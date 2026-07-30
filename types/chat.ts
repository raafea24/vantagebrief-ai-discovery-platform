import type { BriefPatch, WorkspaceRole } from "@/types/workspace";

export interface ChatApiRequest {
  message: string;
  sessionId: string;
  name: string;
  email: string;
  companyName: string;
  role: WorkspaceRole;
  initialChallenge: string;
}

export interface ChatApiResponse {
  success: true;
  type: "chat_response";
  reply: string;
  sessionId: string;
  briefPatch?: BriefPatch;
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
