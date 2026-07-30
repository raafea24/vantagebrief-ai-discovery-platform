import type { RootState } from "@/store";

export const selectConversation = (state: RootState) => state.conversation;
export const selectConversationMessages = (state: RootState) =>
  state.conversation.messages;
