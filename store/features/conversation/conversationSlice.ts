import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConversationState } from "@/types/workspace";
import { sendConversationMessage } from "./conversationThunks";

export const initialConversationState: ConversationState = {
  draft: "",
  messages: [],
  requestStatus: "idle",
  pendingRequestId: null,
  failedRequest: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: initialConversationState,
  reducers: {
    setMessageDraft(state, action: PayloadAction<string>) {
      state.draft = action.payload;
    },
    clearConversationError(state) {
      state.failedRequest = null;
      state.requestStatus = "idle";
    },
    hydrateConversation(_state, action: PayloadAction<ConversationState>) {
      return action.payload;
    },
    resetConversation() {
      return initialConversationState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendConversationMessage.pending, (state, action) => {
        const { message } = action.meta.arg;
        const existingMessage = state.messages.find(
          (existing) => existing.id === message.id,
        );

        if (existingMessage) {
          existingMessage.status = "pending";
        } else {
          state.messages.push({
            ...message,
            sender: "user",
            status: "pending",
          });
        }

        state.requestStatus = "pending";
        state.pendingRequestId = action.meta.requestId;
        state.failedRequest = null;
      })
      .addCase(sendConversationMessage.fulfilled, (state, action) => {
        const userMessage = state.messages.find(
          (message) => message.id === action.payload.userMessageId,
        );

        if (userMessage) {
          userMessage.status = "sent";
        }

        state.messages.push(action.payload.assistantMessage);
        if (state.draft.trim() === userMessage?.content) {
          state.draft = "";
        }
        state.requestStatus = "idle";
        state.pendingRequestId = null;
        state.failedRequest = null;
      })
      .addCase(sendConversationMessage.rejected, (state, action) => {
        if (!action.payload) {
          return;
        }

        const userMessage = state.messages.find(
          (message) => message.id === action.payload?.userMessageId,
        );

        if (userMessage) {
          userMessage.status = "failed";
        }

        state.requestStatus = "failed";
        state.pendingRequestId = null;
        state.failedRequest = {
          messageId: action.payload.userMessageId,
          message: action.payload.message,
        };
      });
  },
});

export const {
  clearConversationError,
  hydrateConversation,
  resetConversation,
  setMessageDraft,
} = conversationSlice.actions;

export const conversationReducer = conversationSlice.reducer;
