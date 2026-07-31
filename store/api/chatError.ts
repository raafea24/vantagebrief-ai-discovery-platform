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
    error.data !== null &&
    "error" in error.data
  ) {
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
