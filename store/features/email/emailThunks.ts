import { createAsyncThunk } from "@reduxjs/toolkit";
import { maskEmail } from "@/lib/email";
import { createBriefFingerprint } from "@/lib/briefFingerprint";
import type { RootState } from "@/store";
import { chatApi } from "@/store/api/chatApi";
import { getSafeChatErrorMessage } from "@/store/api/chatError";
import type { StructuredBriefPayload } from "@/types/chat";
import type { BriefPatch, BriefState } from "@/types/workspace";

const EMAIL_BRIEF_MESSAGE =
  "Send me a structured summary of our conversation by email.";

export type EmailOutcome = "sent" | "failed";

export interface SendBriefEmailResult {
  outcome: EmailOutcome;
  maskedRecipient: string;
  confirmedRecipient: string;
  briefFingerprint: string;
  message?: string;
  briefPatch?: BriefPatch;
}

function createStructuredBriefPayload(
  brief: BriefState,
): StructuredBriefPayload {
  return {
    businessContext: brief.businessContext.value,
    primaryChallenge: brief.primaryChallenge.value,
    currentWorkflow: brief.currentWorkflow.value,
    requirements: brief.requirements.value,
    recommendedDirection: brief.recommendedDirection.value,
    openQuestions: brief.openQuestions.value,
    nextStep: brief.nextStep.value,
  };
}

export const sendBriefEmail = createAsyncThunk<
  SendBriefEmailResult,
  void,
  { state: RootState; rejectValue: string }
>(
  "email/sendBrief",
  async (_argument, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const sessionId = state.session.sessionId;

    if (!sessionId || !state.user.onboardingCompleted) {
      return rejectWithValue(
        "Your discovery session is unavailable. Reopen the workspace and try again.",
      );
    }

    try {
      const result = await dispatch(
        chatApi.endpoints.sendChatMessage.initiate(
          {
            message: EMAIL_BRIEF_MESSAGE,
            sessionId,
            userName: state.user.fullName,
            userEmail: state.user.email,
            companyName: state.user.companyName,
            role: state.user.role,
            initialChallenge: state.user.challenge,
            action: "email_brief",
            brief: createStructuredBriefPayload(state.brief),
          },
          { track: false },
        ),
      ).unwrap();

      const outcome: EmailOutcome =
        result.emailStatus === "sent" && result.success
          ? "sent"
          : "failed";

      return {
        outcome,
        maskedRecipient: maskEmail(state.user.email),
        confirmedRecipient: state.user.email,
        briefFingerprint: createBriefFingerprint(state.brief),
        ...(result.emailMessage ? { message: result.emailMessage } : {}),
        ...(result.brief ? { briefPatch: result.brief } : {}),
      };
    } catch (error) {
      return rejectWithValue(
        getSafeChatErrorMessage(
          error,
          "The email request could not be completed. Your conversation and brief are preserved.",
        ),
      );
    }
  },
  {
    condition: (_argument, { getState }) => {
      const state = getState() as RootState;

      return (
        state.email.status !== "processing" &&
        state.email.status !== "success" &&
        state.conversation.requestStatus !== "pending"
      );
    },
  },
);
