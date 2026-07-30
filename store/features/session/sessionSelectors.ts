import type { RootState } from "@/store";

export const selectSession = (state: RootState) => state.session;
export const selectHydrationStatus = (state: RootState) =>
  state.session.hydrationStatus;
