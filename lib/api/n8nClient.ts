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

export class N8nClientError extends Error {
  constructor(public readonly kind: N8nFailureKind) {
    super(kind);
    this.name = "N8nClientError";
  }
}

interface N8nChatPayload extends ValidatedChatRequest {
  action: "chat" | "email_brief";
  metadata: {
    source: "vantagebrief-web";
    requestId: string;
    timestamp: string;
  };
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
  let environment: ReturnType<typeof getServerEnvironment>;

  try {
    environment = getServerEnvironment();
  } catch {
    throw new N8nClientError("environment");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    environment.N8N_REQUEST_TIMEOUT_MS,
  );
  const payload: N8nChatPayload = {
    ...request,
    action: request.action ?? "chat",
    metadata: {
      source: "vantagebrief-web",
      requestId: randomUUID(),
      timestamp: new Date().toISOString(),
    },
  };

  let response: Response;

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
      throw new N8nClientError("timeout");
    }
    throw new N8nClientError("network");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new N8nClientError("webhook");
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    throw new N8nClientError("malformed_response");
  }

  const parsedResponse = n8nChatResponseSchema.safeParse(responseBody);

  if (
    !parsedResponse.success ||
    parsedResponse.data.sessionId !== request.sessionId
  ) {
    throw new N8nClientError("malformed_response");
  }

  const requestedAction = request.action ?? "chat";

  if (
    requestedAction === "chat" &&
    (!parsedResponse.data.success ||
      parsedResponse.data.type !== "chat_response")
  ) {
    throw new N8nClientError("malformed_response");
  }

  const briefPatch = parsedResponse.data.brief
    ? normalizeBrief(parsedResponse.data.brief)
    : undefined;
  const normalizedType =
    requestedAction === "chat"
      ? "chat_response"
      : parsedResponse.data.emailStatus === "sent"
        ? "email_confirmation"
        : parsedResponse.data.emailStatus === "failed" ||
            !parsedResponse.data.success
          ? "service_error"
          : "chat_response";

  return {
    success: parsedResponse.data.success,
    type: normalizedType,
    reply: parsedResponse.data.reply,
    sessionId: parsedResponse.data.sessionId,
    action: requestedAction,
    ...(briefPatch ? { brief: briefPatch } : {}),
    ...(parsedResponse.data.emailStatus
      ? { emailStatus: parsedResponse.data.emailStatus }
      : {}),
    ...(parsedResponse.data.emailMessage
      ? { emailMessage: parsedResponse.data.emailMessage }
      : {}),
  };
}
