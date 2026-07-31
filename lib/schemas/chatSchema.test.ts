import { describe, expect, it } from "vitest";
import {
  chatApiResponseSchema,
  chatRequestSchema,
  n8nChatResponseSchema,
} from "./chatSchema";

const validRequest = {
  message: "  Help us understand this workflow.  ",
  sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
  name: "  Alex Morgan  ",
  email: "ALEX@EXAMPLE.COM",
  companyName: "  Acme Solutions  ",
  role: "operations",
  initialChallenge: "  Reporting takes too long.  ",
};

describe("chat schemas", () => {
  it("normalizes and validates a complete browser request", () => {
    expect(chatRequestSchema.parse(validRequest)).toEqual({
      message: "Help us understand this workflow.",
      sessionId: validRequest.sessionId,
      name: "Alex Morgan",
      email: "alex@example.com",
      companyName: "Acme Solutions",
      role: "operations",
      initialChallenge: "Reporting takes too long.",
    });
  });

  it("rejects unknown fields and oversized messages", () => {
    expect(
      chatRequestSchema.safeParse({
        ...validRequest,
        message: "x".repeat(4001),
        webhookUrl: "https://not-allowed.example",
      }).success,
    ).toBe(false);
    expect(
      chatRequestSchema.safeParse({
        ...validRequest,
        action: "send_without_confirmation",
      }).success,
    ).toBe(false);
  });

  it("accepts a reply-only n8n response", () => {
    const response = {
      success: true,
      type: "chat_response",
      reply: "Which handoff creates the most delay?",
      sessionId: validRequest.sessionId,
    };

    expect(n8nChatResponseSchema.safeParse(response).success).toBe(true);
    expect(chatApiResponseSchema.safeParse(response).success).toBe(true);
  });

  it("safely omits malformed optional structured data", () => {
    const result = n8nChatResponseSchema.safeParse({
        success: true,
        type: "chat_response",
        reply: "Thanks.",
        sessionId: validRequest.sessionId,
        brief: {
          currentChallenge: {
            status: "identified",
            value: "",
          },
        },
        emailStatus: "maybe",
      });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.brief).toBeUndefined();
      expect(result.data.emailStatus).toBeUndefined();
    }
  });

  it("validates the email action and explicit email response fields", () => {
    expect(
      chatRequestSchema.parse({
        ...validRequest,
        action: "email_brief",
      }).action,
    ).toBe("email_brief");
    expect(
      chatApiResponseSchema.safeParse({
        success: true,
        type: "email_confirmation",
        reply: "The email workflow completed.",
        sessionId: validRequest.sessionId,
        action: "email_brief",
        emailStatus: "sent",
        emailMessage: "Delivery was confirmed.",
      }).success,
    ).toBe(true);
  });
});
