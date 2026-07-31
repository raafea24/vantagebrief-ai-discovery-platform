import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BriefPatch, BriefState } from "@/types/workspace";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";
import { sendBriefEmail } from "@/store/features/email/emailThunks";

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

function hasText(value: string | null) {
  return Boolean(value?.trim());
}

function updateBriefStatuses(state: BriefState) {
  const requiredSections = [
    {
      complete: hasText(state.businessContext.value),
      setStatus: (status: BriefState["businessContext"]["status"]) => {
        state.businessContext.status = status;
      },
    },
    {
      complete: hasText(state.primaryChallenge.value),
      setStatus: (status: BriefState["primaryChallenge"]["status"]) => {
        state.primaryChallenge.status = status;
      },
    },
    {
      complete: state.currentWorkflow.value.length > 0,
      setStatus: (status: BriefState["currentWorkflow"]["status"]) => {
        state.currentWorkflow.status = status;
      },
    },
    {
      complete: state.requirements.value.length > 0,
      setStatus: (status: BriefState["requirements"]["status"]) => {
        state.requirements.status = status;
      },
    },
    {
      complete: hasText(state.recommendedDirection.value),
      setStatus: (status: BriefState["recommendedDirection"]["status"]) => {
        state.recommendedDirection.status = status;
      },
    },
    {
      complete: hasText(state.nextStep.value),
      setStatus: (status: BriefState["nextStep"]["status"]) => {
        state.nextStep.status = status;
      },
    },
  ];
  const firstIncompleteIndex = requiredSections.findIndex(
    (section) => !section.complete,
  );

  requiredSections.forEach((section, index) => {
    section.setStatus(
      section.complete
        ? "complete"
        : index === firstIncompleteIndex
          ? "current"
          : "pending",
    );
  });

  state.openQuestions.status = state.openQuestions.value.length
    ? "complete"
    : "pending";

  if (firstIncompleteIndex === -1) {
    state.status = "complete";
    return;
  }

  state.status = requiredSections.some((section) => section.complete)
    ? "current"
    : "pending";
}

export function applyBriefPatch(state: BriefState, patch: BriefPatch) {
  if (patch.businessContext) {
    state.businessContext.value = patch.businessContext;
  }

  if (patch.primaryChallenge) {
    state.primaryChallenge.value = patch.primaryChallenge;
  }

  if (patch.currentWorkflow?.length) {
    state.currentWorkflow.value = uniqueValues(
      state.currentWorkflow.value,
      patch.currentWorkflow,
    );
  }

  if (patch.requirements?.length) {
    state.requirements.value = uniqueValues(
      state.requirements.value,
      patch.requirements,
    );
  }

  if (patch.recommendedDirection) {
    state.recommendedDirection.value = patch.recommendedDirection;
  }

  if (patch.openQuestions?.length) {
    state.openQuestions.value = uniqueValues(
      state.openQuestions.value,
      patch.openQuestions,
    );
  }

  if (patch.nextStep) {
    state.nextStep.value = patch.nextStep;
  }

  updateBriefStatuses(state);
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
    builder
      .addCase(sendConversationMessage.fulfilled, (state, action) => {
        if (action.payload.briefPatch) {
          applyBriefPatch(state, action.payload.briefPatch);
        }
      })
      .addCase(sendBriefEmail.fulfilled, (state, action) => {
        if (action.payload.briefPatch) {
          applyBriefPatch(state, action.payload.briefPatch);
        }
      });
  },
});

export const { hydrateBrief, resetBrief } = briefSlice.actions;
export const briefReducer = briefSlice.reducer;
