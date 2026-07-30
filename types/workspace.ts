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

export type WorkspaceMode = "empty" | "initiated";

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

export interface LocalUserMessage {
  id: string;
  content: string;
  createdAt: string;
}

export interface ConversationState {
  draft: string;
  firstMessage: LocalUserMessage | null;
}

export type BriefSectionStatus = "available" | "current" | "pending";

export type BriefSectionKey =
  | "businessContext"
  | "primaryChallenge"
  | "currentWorkflow"
  | "requirements"
  | "recommendedDirection"
  | "openQuestions"
  | "nextStep";

export interface BriefState {
  status: "not_started";
  sections: Record<BriefSectionKey, BriefSectionStatus>;
}
