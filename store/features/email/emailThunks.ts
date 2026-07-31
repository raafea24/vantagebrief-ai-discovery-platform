import { createAsyncThunk } from "@reduxjs/toolkit";
import { maskEmail } from "@/lib/email";
import type { RootState } from "@/store";
import { chatApi } from "@/store/api/chatApi";
import { getSafeChatErrorMessage } from "@/store/api/chatError";
import type { BriefPatch } from "@/types/workspace";

const EMAIL_BRIEF_MESSAGE =
  "Send me a structured summary of our conversation by email.";

export type EmailOutcome = "sent" | "failed" | "unconfirmed";

export interface SendBriefEmailResult {
  outcome: EmailOutcome;
  maskedRecipient: string;
  message?: string;
  briefPatch?: BriefPatch;
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
            name: state.user.fullName,
            email: state.user.email,
            companyName: state.user.companyName,
            role: state.user.role,
            initialChallenge: state.user.challenge,
            action: "email_brief",
          },
          { track: false },
        ),
      ).unwrap();

      const outcome: EmailOutcome =
        result.emailStatus === "sent" && result.success
          ? "sent"
          : result.emailStatus === "failed" || !result.success
            ? "failed"
            : "unconfirmed";

      return {
        outcome,
        maskedRecipient: maskEmail(state.user.email),
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
        state.conversation.requestStatus !== "pending"
      );
    },
  },
);
