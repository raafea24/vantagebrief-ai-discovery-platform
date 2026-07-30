import type { RootState } from "@/store";

export const selectConversation = (state: RootState) => state.conversation;
