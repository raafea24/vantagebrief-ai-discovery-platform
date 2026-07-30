import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BriefState } from "@/types/workspace";

export const initialBriefState: BriefState = {
  status: "not_started",
  sections: {
    businessContext: "available",
    primaryChallenge: "current",
    currentWorkflow: "pending",
    requirements: "pending",
    recommendedDirection: "pending",
    openQuestions: "pending",
    nextStep: "pending",
  },
};

const briefSlice = createSlice({
  name: "brief",
  initialState: initialBriefState,
  reducers: {
    hydrateBrief(_state, action: PayloadAction<BriefState>) {
      return action.payload;
    },
    resetBrief() {
      return initialBriefState;
    },
  },
});

export const { hydrateBrief, resetBrief } = briefSlice.actions;
export const briefReducer = briefSlice.reducer;
