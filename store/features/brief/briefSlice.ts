import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BriefPatch, BriefState } from "@/types/workspace";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";
import { sendBriefEmail } from "@/store/features/email/emailThunks";
import { setUserProfile } from "@/store/features/user/userSlice";

export const initialBriefState: BriefState = {
  status: "pending",
  businessContext: { value: null, status: "current" },
  primaryChallenge: { value: null, status: "pending" },
  currentWorkflow: { value: [], status: "pending" },
  requirements: { value: [], status: "pending" },
  recommendedDirection: { value: null, status: "pending" },
  openQuestions: { value: [], status: "pending" },
  nextStep: { value: null, status: "pending" },
};

function meaningfulText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized && normalized.length >= 3 ? normalized : null;
}

function uniqueValues(existing: string[], incoming: string[]) {
  const meaningfulIncoming = incoming
    .map((value) => meaningfulText(value))
    .filter((value): value is string => Boolean(value));
  return Array.from(new Set([...existing, ...meaningfulIncoming]));
}

function hasText(value: string | null) {
  return Boolean(meaningfulText(value));
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
  const businessContext = meaningfulText(patch.businessContext);
  const primaryChallenge = meaningfulText(patch.primaryChallenge);
  const recommendedDirection = meaningfulText(patch.recommendedDirection);
  const nextStep = meaningfulText(patch.nextStep);

  if (businessContext) {
    state.businessContext.value = businessContext;
  }

  if (primaryChallenge) {
    state.primaryChallenge.value = primaryChallenge;
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

  if (recommendedDirection) {
    state.recommendedDirection.value = recommendedDirection;
  }

  if (patch.openQuestions?.length) {
    state.openQuestions.value = uniqueValues(
      state.openQuestions.value,
      patch.openQuestions,
    );
  }

  if (nextStep) {
    state.nextStep.value = nextStep;
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
      .addCase(setUserProfile, (state, action) => {
        state.businessContext.value = `${action.payload.companyName} · ${action.payload.role.replaceAll("_", " ")}`;
        state.primaryChallenge.value = action.payload.challenge;
        updateBriefStatuses(state);
      })
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
