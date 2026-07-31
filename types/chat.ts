import type { BriefPatch, WorkspaceRole } from "@/types/workspace";

export type ChatAction = "chat" | "email_brief";
export type EmailDeliveryStatus = "sent" | "failed";

export interface ChatApiRequest {
  message: string;
  sessionId: string;
  name: string;
  email: string;
  companyName: string;
  role: WorkspaceRole;
  initialChallenge: string;
  action?: ChatAction;
}

export interface ChatApiResponse {
  success: boolean;
  type: "chat_response" | "email_confirmation" | "service_error";
  reply: string;
  sessionId: string;
  action?: ChatAction;
  brief?: BriefPatch;
  emailStatus?: EmailDeliveryStatus;
  emailMessage?: string;
}

export type PublicChatErrorCode =
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "REQUEST_TIMEOUT"
  | "UNKNOWN_ERROR";

export interface PublicChatError {
  code: PublicChatErrorCode;
  message: string;
  retryable: boolean;
}

export interface ChatApiErrorResponse {
  error: PublicChatError;
}
