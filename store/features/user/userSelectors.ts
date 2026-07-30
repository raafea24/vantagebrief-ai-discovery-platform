import type { RootState } from "@/store";

export const selectUser = (state: RootState) => state.user;
export const selectOnboardingCompleted = (state: RootState) =>
  state.user.onboardingCompleted;
