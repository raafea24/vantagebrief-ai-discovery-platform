import { describe, expect, it } from "vitest";
import {
  initialConversationState,
  setMessageDraft,
  submitFirstMessage,
  conversationReducer,
} from "./conversationSlice";

const firstMessage = {
  id: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
  content: "Where is our current process slowing down?",
  createdAt: "2026-07-31T08:00:00.000Z",
};

describe("conversationSlice", () => {
  it("stores a draft and accepts only the first submitted message", () => {
    const withDraft = conversationReducer(
      initialConversationState,
      setMessageDraft(firstMessage.content),
    );
    const initiated = conversationReducer(
      withDraft,
      submitFirstMessage(firstMessage),
    );
    const duplicate = conversationReducer(
      initiated,
      submitFirstMessage({
        ...firstMessage,
        id: "1ea93e4f-842a-46d4-bd86-7d5b8342a8ee",
        content: "A duplicate message",
      }),
    );

    expect(initiated.draft).toBe("");
    expect(duplicate.firstMessage).toEqual(firstMessage);
  });
});
