import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BriefPatch, BriefState } from "@/types/workspace";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";

export const initialBriefState: BriefState = {
  status: "pending",
  businessContext: { value: null, status: "complete" },
  primaryChallenge: { value: null, status: "current" },
  currentWorkflow: { value: [], status: "pending" },
  requirements: { value: [], status: "pending" },
  recommendedDirection: { value: null, status: "pending" },
  openQuestions: { value: [], status: "pending" },
  nextStep: { value: null, status: "pending" },
};

function uniqueValues(existing: string[], incoming: string[]) {
  return Array.from(new Set([...existing, ...incoming]));
}

function applyBriefPatch(state: BriefState, patch: BriefPatch) {
  if (patch.businessContext) {
    state.businessContext.value = patch.businessContext;
  }

  if (patch.primaryChallenge) {
    state.primaryChallenge.value = patch.primaryChallenge;
    state.primaryChallenge.status = "current";
  }

  if (patch.currentWorkflow?.length) {
    state.currentWorkflow.value = uniqueValues(
      state.currentWorkflow.value,
      patch.currentWorkflow,
    );
    state.currentWorkflow.status = "current";
    state.primaryChallenge.status = "complete";
  }

  if (patch.requirements?.length) {
    state.requirements.value = uniqueValues(
      state.requirements.value,
      patch.requirements,
    );
    state.requirements.status = "current";
    state.currentWorkflow.status = "complete";
  }

  if (patch.recommendedDirection) {
    state.recommendedDirection.value = patch.recommendedDirection;
    state.recommendedDirection.status = "current";
    state.requirements.status = "complete";
  }

  if (patch.openQuestions?.length) {
    state.openQuestions.value = patch.openQuestions;
    state.openQuestions.status = "current";
  }

  if (patch.nextStep) {
    state.nextStep.value = patch.nextStep;
    state.nextStep.status = "current";
  }

  const isComplete =
    state.primaryChallenge.value &&
    state.currentWorkflow.value.length > 0 &&
    state.requirements.value.length > 0 &&
    state.recommendedDirection.value &&
    state.nextStep.value;

  state.status = isComplete ? "complete" : "current";

  if (isComplete) {
    state.primaryChallenge.status = "complete";
    state.currentWorkflow.status = "complete";
    state.requirements.status = "complete";
    state.recommendedDirection.status = "complete";
    state.openQuestions.status = "complete";
    state.nextStep.status = "complete";
  }
}

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
  extraReducers: (builder) => {
    builder.addCase(sendConversationMessage.fulfilled, (state, action) => {
      if (action.payload.briefPatch) {
        applyBriefPatch(state, action.payload.briefPatch);
      }
    });
  },
});

export const { hydrateBrief, resetBrief } = briefSlice.actions;
export const briefReducer = briefSlice.reducer;
