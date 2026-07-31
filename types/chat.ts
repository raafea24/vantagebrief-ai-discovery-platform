import type { BriefPatch, WorkspaceRole } from "@/types/workspace";

export type ChatAction = "chat" | "email_brief";
export type EmailDeliveryStatus = "sent" | "failed";

export interface StructuredBriefPayload {
  businessContext: string | null;
  primaryChallenge: string | null;
  currentWorkflow: string[];
  requirements: string[];
  recommendedDirection: string | null;
  openQuestions: string[];
  nextStep: string | null;
}

interface ChatApiRequestBase {
  message: string;
  sessionId: string;
  companyName: string;
  role: WorkspaceRole;
  initialChallenge: string;
}

export interface ConversationChatApiRequest extends ChatApiRequestBase {
  action?: "chat";
  name: string;
  email: string;
}

export interface EmailBriefChatApiRequest extends ChatApiRequestBase {
  action: "email_brief";
  userName: string;
  userEmail: string;
  brief: StructuredBriefPayload;
}

export type ChatApiRequest =
  | ConversationChatApiRequest
  | EmailBriefChatApiRequest;

export interface ChatApiResponse {
  httpStatus?: number;
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
