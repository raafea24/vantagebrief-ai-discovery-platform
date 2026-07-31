import { describe, expect, it } from "vitest";
import {
  chatApiResponseSchema,
  chatRequestSchema,
  n8nChatResponseSchema,
} from "./chatSchema";

const validRequest = {
  action: "chat",
  message: "  Help us understand this workflow.  ",
  sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
  name: "  Alex Morgan  ",
  email: "ALEX@EXAMPLE.COM",
  companyName: "  Acme Solutions  ",
  role: "operations",
  initialChallenge: "  Reporting takes too long.  ",
};

const validBrief = {
  businessContext: "Acme prepares monthly operational reports.",
  primaryChallenge: "Reporting takes too long.",
  currentWorkflow: ["Analysts consolidate data manually."],
  requirements: ["Centralize reporting inputs."],
  recommendedDirection: "Map and simplify the reporting workflow.",
  openQuestions: ["Which report should be piloted first?"],
  nextStep: "Run a workflow-mapping session.",
};

const validEmailRequest = {
  message: "Send the current Opportunity Brief.",
  sessionId: validRequest.sessionId,
  userName: "  Alex Morgan  ",
  userEmail: "ALEX@EXAMPLE.COM",
  companyName: "  Acme Solutions  ",
  role: "operations",
  initialChallenge: "  Reporting takes too long.  ",
  action: "email_brief",
  brief: validBrief,
};

describe("chat schemas", () => {
  it("normalizes and validates a complete browser request", () => {
    expect(chatRequestSchema.parse(validRequest)).toEqual({
      action: "chat",
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

  it("requires an explicit action for every request", () => {
    expect(
      chatRequestSchema.safeParse({ ...validRequest, action: undefined })
        .success,
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
      chatRequestSchema.parse(validEmailRequest),
    ).toMatchObject({
      action: "email_brief",
      userName: "Alex Morgan",
      userEmail: "alex@example.com",
      brief: validBrief,
    });
    expect(
      chatRequestSchema.safeParse({
        ...validRequest,
        action: "email_brief",
      }).success,
    ).toBe(false);
    expect(
      chatApiResponseSchema.safeParse({
        httpStatus: 200,
        success: true,
        type: "email_confirmation",
        reply: "Your Opportunity Brief has been sent to your email.",
        sessionId: validRequest.sessionId,
        action: "email_brief",
        emailStatus: "sent",
        emailMessage: "The Opportunity Brief was emailed successfully.",
      }).success,
    ).toBe(true);
    expect(
      n8nChatResponseSchema.parse({
        httpStatus: 502,
        success: false,
        type: "service_error",
        reply: "The brief could not be emailed. Please try again.",
        sessionId: validRequest.sessionId,
        action: "email_brief",
        emailStatus: "failed",
        emailMessage: "The Opportunity Brief could not be emailed.",
      }).emailStatus,
    ).toBe("failed");
  });
});
