import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ConversationState,
  LocalUserMessage,
} from "@/types/workspace";

export const initialConversationState: ConversationState = {
  draft: "",
  firstMessage: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: initialConversationState,
  reducers: {
    setMessageDraft(state, action: PayloadAction<string>) {
      state.draft = action.payload;
    },
    submitFirstMessage(state, action: PayloadAction<LocalUserMessage>) {
      if (state.firstMessage) {
        return;
      }

      state.firstMessage = action.payload;
      state.draft = "";
    },
    hydrateConversation(_state, action: PayloadAction<ConversationState>) {
      return action.payload;
    },
    resetConversation() {
      return initialConversationState;
    },
  },
});

export const {
  hydrateConversation,
  resetConversation,
  setMessageDraft,
  submitFirstMessage,
} = conversationSlice.actions;

export const conversationReducer = conversationSlice.reducer;
