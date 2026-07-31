import { createSlice } from "@reduxjs/toolkit";
import { resetSession } from "@/store/features/session/sessionSlice";
import { setUserProfile } from "@/store/features/user/userSlice";
import type { EmailState } from "@/types/workspace";
import { sendBriefEmail } from "./emailThunks";

export const initialEmailState: EmailState = {
  status: "idle",
  maskedRecipient: null,
  message: null,
  error: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState: initialEmailState,
  reducers: {
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
          state.message =
            action.payload.message ?? "Your brief has been sent.";
          state.error = null;
          return;
        }

        if (action.payload.outcome === "failed") {
          state.status = "failed";
          state.maskedRecipient = action.payload.maskedRecipient;
          state.message = null;
          state.error =
            action.payload.message ??
            "Your brief could not be emailed. Please try again.";
          return;
        }

        state.status = "neutral";
        state.maskedRecipient = action.payload.maskedRecipient;
        state.message =
          "The request completed without a delivery confirmation. You can try again.";
        state.error = null;
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
      .addCase(setUserProfile, () => initialEmailState)
      .addCase(resetSession, () => initialEmailState);
  },
});

export const { resetEmailState } = emailSlice.actions;
export const emailReducer = emailSlice.reducer;
