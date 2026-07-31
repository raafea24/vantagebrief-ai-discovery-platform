import { createSlice } from "@reduxjs/toolkit";
import { resetSession } from "@/store/features/session/sessionSlice";
import type { EmailState } from "@/types/workspace";
import { sendBriefEmail } from "./emailThunks";

export const initialEmailState: EmailState = {
  status: "idle",
  maskedRecipient: null,
  confirmedRecipient: null,
  message: null,
  error: null,
  sentBriefFingerprint: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState: initialEmailState,
  reducers: {
    hydrateEmail(_state, action: { payload: EmailState }) {
      return action.payload;
    },
    markBriefUpdatedSinceEmail(state) {
      if (state.sentBriefFingerprint) {
        state.status = "updated";
        state.error = null;
      }
    },
    resetEmailState() {
      return initialEmailState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendBriefEmail.pending, (state) => {
        state.status = "processing";
        state.message = null;
        state.error = null;
      })
      .addCase(sendBriefEmail.fulfilled, (state, action) => {
        if (action.payload.outcome === "sent") {
          state.status = "success";
          state.maskedRecipient = action.payload.maskedRecipient;
          state.confirmedRecipient = action.payload.confirmedRecipient;
          state.sentBriefFingerprint = action.payload.briefFingerprint;
          state.message =
            action.payload.message ?? "Your brief has been sent.";
          state.error = null;
          return;
        }

        state.status = "failed";
        state.maskedRecipient = action.payload.maskedRecipient;
        state.message = null;
        state.error =
          action.payload.message ??
          "Your brief could not be emailed. Please try again.";
      })
      .addCase(sendBriefEmail.rejected, (state, action) => {
        if (action.meta.condition) {
          return;
        }

        state.status = "failed";
        state.message = null;
        state.error =
          action.payload ??
          "The email request could not be completed. Please try again.";
      })
      .addCase(resetSession, () => initialEmailState);
  },
});

export const { hydrateEmail, markBriefUpdatedSinceEmail, resetEmailState } =
  emailSlice.actions;
export const emailReducer = emailSlice.reducer;
