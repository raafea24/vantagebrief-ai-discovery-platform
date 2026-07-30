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
