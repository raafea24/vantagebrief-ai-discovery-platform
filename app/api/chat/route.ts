import { NextResponse, type NextRequest } from "next/server";
import {
  N8nClientError,
  mapN8nErrorCode,
  sendN8nChatRequest,
} from "@/lib/api/n8nClient";
import { chatRequestSchema } from "@/lib/schemas/chatSchema";
import type {
  ChatApiErrorResponse,
  PublicChatError,
  PublicChatErrorCode,
} from "@/types/chat";

const MAX_REQUEST_BYTES = 16_384;

const publicErrors: Record<PublicChatErrorCode, PublicChatError> = {
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "Review the information provided and try again.",
    retryable: false,
  },
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    message:
      "We could not reach the discovery service. Your message has not been lost. Please try again.",
    retryable: true,
  },
  SERVICE_UNAVAILABLE: {
    code: "SERVICE_UNAVAILABLE",
    message:
      "The discovery service is temporarily unavailable. Please try again shortly.",
    retryable: true,
  },
  REQUEST_TIMEOUT: {
    code: "REQUEST_TIMEOUT",
    message:
      "The discovery service took longer than expected. Please try again.",
    retryable: true,
  },
  UNKNOWN_ERROR: {
    code: "UNKNOWN_ERROR",
    message: "Something prevented the request from completing. Please try again.",
    retryable: true,
  },
};

function errorResponse(code: PublicChatErrorCode, status: number) {
  const body: ChatApiErrorResponse = { error: publicErrors[code] };

  return NextResponse.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_REQUEST_BYTES) {
    return errorResponse("VALIDATION_ERROR", 413);
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return errorResponse("VALIDATION_ERROR", 400);
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return errorResponse("VALIDATION_ERROR", 413);
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("VALIDATION_ERROR", 400);
  }

  const parsedRequest = chatRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return errorResponse("VALIDATION_ERROR", 400);
  }

  try {
    const response = await sendN8nChatRequest(parsedRequest.data);

    return NextResponse.json(response, {
      status: 200,
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    if (error instanceof N8nClientError) {
      const code = mapN8nErrorCode(error);
      return errorResponse(
        code,
        code === "REQUEST_TIMEOUT" ? 504 : 503,
      );
    }

    return errorResponse("UNKNOWN_ERROR", 500);
  }
}
