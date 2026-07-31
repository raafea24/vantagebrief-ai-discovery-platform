export const workspaceRoles = [
  "business_owner",
  "operations",
  "strategy_consulting",
  "sales_business_development",
  "product_technology",
  "other",
] as const;

export type WorkspaceRole = (typeof workspaceRoles)[number];

export interface OnboardingProfile {
  fullName: string;
  companyName: string;
  email: string;
  role: WorkspaceRole;
  challenge: string;
}

export interface UserState extends OnboardingProfile {
  onboardingCompleted: boolean;
}

export type SessionStatus = "idle" | "active" | "resetting";
export type HydrationStatus = "idle" | "hydrating" | "ready";

export interface SessionState {
  sessionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  status: SessionStatus;
  hydrationStatus: HydrationStatus;
}

export type WorkspaceMode = "empty" | "active";

export type DiscoveryStage =
  | "context"
  | "challenge"
  | "workflow"
  | "requirements"
  | "direction"
  | "brief";

export interface WorkspaceState {
  mode: WorkspaceMode;
  discoveryStage: DiscoveryStage;
}

export type MessageSender = "user" | "assistant";
export type MessageStatus = "pending" | "sent" | "failed";
export type RequestStatus = "idle" | "pending" | "failed";

export interface ConversationMessage {
  id: string;
  sender: MessageSender;
  content: string;
  createdAt: string;
  status: MessageStatus;
}

export interface LocalUserMessage {
  id: string;
  content: string;
  createdAt: string;
}

export interface FailedRequest {
  messageId: string;
  message: string;
}

export interface ConversationState {
  draft: string;
  messages: ConversationMessage[];
  requestStatus: RequestStatus;
  pendingRequestId: string | null;
  failedRequest: FailedRequest | null;
}

export type BriefSectionStatus = "complete" | "current" | "pending";

export interface BriefField<T> {
  value: T;
  status: BriefSectionStatus;
}

export interface BriefState {
  status: BriefSectionStatus;
  businessContext: BriefField<string | null>;
  primaryChallenge: BriefField<string | null>;
  currentWorkflow: BriefField<string[]>;
  requirements: BriefField<string[]>;
  recommendedDirection: BriefField<string | null>;
  openQuestions: BriefField<string[]>;
  nextStep: BriefField<string | null>;
}

export interface BriefPatch {
  businessContext?: string;
  primaryChallenge?: string;
  currentWorkflow?: string[];
  requirements?: string[];
  openQuestions?: string[];
  recommendedDirection?: string;
  nextStep?: string;
}

export type EmailRequestStatus =
  | "idle"
  | "processing"
  | "success"
  | "neutral"
  | "failed";

export interface EmailState {
  status: EmailRequestStatus;
  maskedRecipient: string | null;
  message: string | null;
  error: string | null;
}
