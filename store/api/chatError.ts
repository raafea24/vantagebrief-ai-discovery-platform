import type { ChatApiErrorResponse } from "@/types/chat";

export function getSafeChatErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    if (
      "emailStatus" in error.data &&
      error.data.emailStatus === "failed" &&
      "emailMessage" in error.data &&
      typeof error.data.emailMessage === "string" &&
      error.data.emailMessage.length <= 300
    ) {
      return error.data.emailMessage;
    }

    if (!("error" in error.data)) {
      return fallback;
    }

    const data = error.data as ChatApiErrorResponse;

    if (
      typeof data.error?.message === "string" &&
      data.error.message.length <= 300
    ) {
      return data.error.message;
    }
  }

  return fallback;
}
