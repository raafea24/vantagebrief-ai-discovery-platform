import { describe, expect, it } from "vitest";
import {
  conversationReducer,
  initialConversationState,
  setMessageDraft,
} from "./conversationSlice";
import { sendConversationMessage } from "./conversationThunks";

const message = {
  id: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
  content: "Where is our current process slowing down?",
  createdAt: "2026-07-31T08:00:00.000Z",
};

describe("conversationSlice", () => {
  it("stores a draft and prevents duplicate message insertion while pending", () => {
    const withDraft = conversationReducer(
      initialConversationState,
      setMessageDraft(message.content),
    );
    const pendingAction = sendConversationMessage.pending("request-1", {
      message,
    });
    const pending = conversationReducer(withDraft, pendingAction);
    const duplicate = conversationReducer(pending, pendingAction);

    expect(duplicate.messages).toHaveLength(1);
    expect(duplicate.messages[0]).toMatchObject({
      ...message,
      sender: "user",
      status: "pending",
    });
    expect(duplicate.requestStatus).toBe("pending");
    expect(duplicate.draft).toBe(message.content);
  });

  it("preserves a failed message and exposes retry information", () => {
    const withDraft = conversationReducer(
      initialConversationState,
      setMessageDraft(message.content),
    );
    const pending = conversationReducer(
      withDraft,
      sendConversationMessage.pending("request-1", { message }),
    );
    const rejected = conversationReducer(
      pending,
      sendConversationMessage.rejected(
        new Error("unavailable"),
        "request-1",
        { message },
        {
          userMessageId: message.id,
          message: "Your message is preserved.",
        },
      ),
    );

    expect(rejected.messages[0].status).toBe("failed");
    expect(rejected.failedRequest).toEqual({
      messageId: message.id,
      message: "Your message is preserved.",
    });
    expect(rejected.draft).toBe(message.content);
  });
});
