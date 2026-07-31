import "server-only";
import { randomUUID } from "node:crypto";
import { getServerEnvironment } from "@/lib/env";
import {
  briefPatchSchema,
  n8nChatResponseSchema,
  n8nStructuredBriefSchema,
  type ValidatedChatRequest,
} from "@/lib/schemas/chatSchema";
import type { ChatApiResponse, PublicChatErrorCode } from "@/types/chat";
import type { BriefPatch } from "@/types/workspace";

type N8nFailureKind =
  | "environment"
  | "network"
  | "timeout"
  | "webhook"
  | "malformed_response";

type N8nDiagnosticErrorCategory = N8nFailureKind | "email_delivery";

export class N8nClientError extends Error {
  constructor(
    public readonly kind: N8nFailureKind,
    public readonly requestId?: string,
  ) {
    super(kind);
    this.name = "N8nClientError";
  }
}

interface N8nRequestMetadata {
  source: "vantagebrief-web";
  requestId: string;
  timestamp: string;
}

interface N8nDiagnostic {
  requestId: string;
  action: ValidatedChatRequest["action"];
  httpStatus: number | null;
  upstreamDurationMs: number;
  responseType: string | null;
  replyExists: boolean;
  briefExists: boolean;
  errorCategory: N8nDiagnosticErrorCategory | null;
}

function responseSummary(responseBody: unknown) {
  if (!responseBody || typeof responseBody !== "object") {
    return {
      responseType: null,
      replyExists: false,
      briefExists: false,
    };
  }

  const value = responseBody as Record<string, unknown>;

  return {
    responseType: typeof value.type === "string" ? value.type : null,
    replyExists:
      typeof value.reply === "string" && value.reply.trim().length > 0,
    briefExists: value.brief !== undefined && value.brief !== null,
  };
}

function logN8nDiagnostic(diagnostic: N8nDiagnostic) {
  const message = "VantageBrief n8n request";

  if (diagnostic.errorCategory) {
    console.warn(message, diagnostic);
    return;
  }

  console.info(message, diagnostic);
}

function normalizeBrief(brief: unknown): BriefPatch | undefined {
  const directPatch = briefPatchSchema.safeParse(brief);

  if (directPatch.success) {
    return directPatch.data;
  }

  const structuredBrief = n8nStructuredBriefSchema.safeParse(brief);

  if (!structuredBrief.success) {
    return undefined;
  }

  const value = structuredBrief.data;
  const patch: BriefPatch = {};

  if (value.businessContext) {
    patch.businessContext = value.businessContext.value;
  }
  if (value.currentChallenge) {
    patch.primaryChallenge = value.currentChallenge.value;
  }
  if (value.existingWorkflow) {
    patch.currentWorkflow = [value.existingWorkflow.value];
  }
  if (value.requirements) {
    patch.requirements = value.requirements.values;
  }
  if (value.recommendedDirection) {
    patch.recommendedDirection = value.recommendedDirection.value;
  }
  if (value.openQuestions) {
    patch.openQuestions = value.openQuestions.values;
  }
  if (value.recommendedNextStep) {
    patch.nextStep = value.recommendedNextStep.value;
  }

  return Object.keys(patch).length > 0 ? patch : undefined;
}

export function mapN8nErrorCode(
  error: N8nClientError,
): PublicChatErrorCode {
  if (error.kind === "timeout") {
    return "REQUEST_TIMEOUT";
  }
  if (error.kind === "network") {
    return "NETWORK_ERROR";
  }
  return "SERVICE_UNAVAILABLE";
}

export async function sendN8nChatRequest(
  request: ValidatedChatRequest,
): Promise<ChatApiResponse> {
  const requestId = randomUUID();
  const startedAt = Date.now();
  let environment!: ReturnType<typeof getServerEnvironment>;

  const logResult = (
    errorCategory: N8nDiagnosticErrorCategory | null,
    httpStatus: number | null,
    responseBody?: unknown,
  ) => {
    logN8nDiagnostic({
      requestId,
      action: request.action,
      httpStatus,
      upstreamDurationMs: Date.now() - startedAt,
      ...responseSummary(responseBody),
      errorCategory,
    });
  };

  const fail = (
    kind: N8nFailureKind,
    httpStatus: number | null,
    responseBody?: unknown,
  ): never => {
    logResult(kind, httpStatus, responseBody);
    throw new N8nClientError(kind, requestId);
  };

  try {
    environment = getServerEnvironment();
  } catch {
    fail("environment", null);
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    environment.N8N_REQUEST_TIMEOUT_MS,
  );
  const metadata: N8nRequestMetadata = {
    source: "vantagebrief-web",
    requestId,
    timestamp: new Date().toISOString(),
  };
  const payload = {
    ...request,
    action: request.action,
    metadata: {
      ...metadata,
    },
  };

  let response!: Response;

  try {
    response = await fetch(environment.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        [environment.N8N_WEBHOOK_HEADER_NAME]:
          environment.N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (
      controller.signal.aborted ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      fail("timeout", null);
    }
    fail("network", null);
  } finally {
    clearTimeout(timeout);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    fail(response.ok ? "malformed_response" : "webhook", response.status);
  }

  const parsedResponse = n8nChatResponseSchema.safeParse(responseBody);

  if (!parsedResponse.success || !parsedResponse.data) {
    logResult("malformed_response", response.status, responseBody);
    throw new N8nClientError("malformed_response", requestId);
  }

  const parsedData = parsedResponse.data;

  if (parsedData.sessionId !== request.sessionId) {
    fail("malformed_response", response.status, responseBody);
  }

  const requestedAction = request.action;

  const briefPatch = parsedData.brief
    ? normalizeBrief(parsedData.brief)
    : undefined;

  if (requestedAction === "chat") {
    if (!response.ok) {
      fail("webhook", response.status, responseBody);
    }
    if (
      !parsedData.success ||
      parsedData.type !== "chat_response"
    ) {
      fail("malformed_response", response.status, responseBody);
    }

    logResult(null, response.status, responseBody);

    return {
      success: true,
      type: "chat_response",
      reply: parsedData.reply,
      sessionId: parsedData.sessionId,
      action: "chat",
      ...(briefPatch ? { brief: briefPatch } : {}),
    };
  }

  const isConfirmedSuccess =
    response.ok &&
    parsedData.httpStatus === 200 &&
    parsedData.success === true &&
    parsedData.type === "email_confirmation" &&
    parsedData.action === "email_brief" &&
    parsedData.emailStatus === "sent";
  const isConfirmedFailure =
    parsedData.httpStatus === 502 &&
    parsedData.success === false &&
    parsedData.type === "service_error" &&
    parsedData.action === "email_brief" &&
    parsedData.emailStatus === "failed" &&
    (response.ok || response.status === 502);

  if (!isConfirmedSuccess && !isConfirmedFailure) {
    fail(
      response.ok ? "malformed_response" : "webhook",
      response.status,
      responseBody,
    );
  }

  logResult(
    isConfirmedSuccess ? null : "email_delivery",
    response.status,
    responseBody,
  );

  return {
    httpStatus: isConfirmedSuccess ? 200 : 502,
    success: isConfirmedSuccess,
    type: isConfirmedSuccess ? "email_confirmation" : "service_error",
    reply: parsedData.reply,
    sessionId: parsedData.sessionId,
    action: "email_brief",
    ...(briefPatch ? { brief: briefPatch } : {}),
    emailStatus: isConfirmedSuccess ? "sent" : "failed",
    ...(parsedData.emailMessage
      ? { emailMessage: parsedData.emailMessage }
      : {}),
  };
}
