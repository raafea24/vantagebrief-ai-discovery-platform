import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/n8nClient", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/api/n8nClient")
  >("@/lib/api/n8nClient");

  return {
    ...actual,
    sendN8nChatRequest: vi.fn(),
  };
});

import { NextRequest } from "next/server";
import {
  N8nClientError,
  sendN8nChatRequest,
} from "@/lib/api/n8nClient";
import { POST } from "./route";

const validBody = {
  message: "Our reporting handoff is unclear.",
  sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
  name: "Alex Morgan",
  email: "alex@example.com",
  companyName: "Acme Solutions",
  role: "operations",
  initialChallenge: "Reporting takes too long.",
};

const emailBody = {
  message: "Send the current Opportunity Brief.",
  sessionId: validBody.sessionId,
  userName: "Alex Morgan",
  userEmail: "alex@example.com",
  companyName: validBody.companyName,
  role: validBody.role,
  initialChallenge: validBody.initialChallenge,
  action: "email_brief",
  brief: {
    businessContext: "Acme prepares monthly operational reports.",
    primaryChallenge: "Reporting takes too long.",
    currentWorkflow: ["Analysts consolidate reports manually."],
    requirements: ["Centralize reporting inputs."],
    recommendedDirection: "Map and simplify the reporting workflow.",
    openQuestions: ["Which report should be piloted first?"],
    nextStep: "Run a workflow-mapping session.",
  },
};

function createRequest(body: string) {
  return new NextRequest("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

beforeEach(() => {
  vi.mocked(sendN8nChatRequest).mockReset();
});

describe("POST /api/chat", () => {
  it("rejects invalid input without contacting n8n", async () => {
    const response = await POST(
      createRequest(JSON.stringify({ ...validBody, email: "invalid" })),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Review the information provided and try again.",
        retryable: false,
      },
    });
    expect(sendN8nChatRequest).not.toHaveBeenCalled();
  });

  it("returns the safe normalized service response", async () => {
    vi.mocked(sendN8nChatRequest).mockResolvedValue({
      success: true,
      type: "chat_response",
      reply: "Who approves the final report?",
      sessionId: validBody.sessionId,
    });

    const response = await POST(createRequest(JSON.stringify(validBody)));

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toMatchObject({
      success: true,
      reply: "Who approves the final report?",
    });
  });

  it("validates and forwards an explicit email brief action", async () => {
    vi.mocked(sendN8nChatRequest).mockResolvedValue({
      httpStatus: 200,
      success: true,
      type: "email_confirmation",
      reply: "Your Opportunity Brief has been sent to your email.",
      sessionId: validBody.sessionId,
      action: "email_brief",
      emailStatus: "sent",
      emailMessage: "The Opportunity Brief was emailed successfully.",
    });

    const response = await POST(
      createRequest(JSON.stringify(emailBody)),
    );

    expect(sendN8nChatRequest).toHaveBeenCalledWith(emailBody);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      emailStatus: "sent",
      emailMessage: "The Opportunity Brief was emailed successfully.",
    });
  });

  it("preserves a validated production email failure status", async () => {
    vi.mocked(sendN8nChatRequest).mockResolvedValue({
      httpStatus: 502,
      success: false,
      type: "service_error",
      reply: "The brief could not be emailed. Please try again.",
      sessionId: validBody.sessionId,
      action: "email_brief",
      emailStatus: "failed",
      emailMessage: "The Opportunity Brief could not be emailed.",
    });

    const response = await POST(createRequest(JSON.stringify(emailBody)));

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({
      success: false,
      emailStatus: "failed",
      emailMessage: "The Opportunity Brief could not be emailed.",
    });
  });

  it("normalizes timeout errors without exposing internal details", async () => {
    vi.mocked(sendN8nChatRequest).mockRejectedValue(
      new N8nClientError("timeout"),
    );

    const response = await POST(createRequest(JSON.stringify(validBody)));

    expect(response.status).toBe(504);
    expect(await response.json()).toEqual({
      error: {
        code: "REQUEST_TIMEOUT",
        message:
          "The discovery service took longer than expected. Please try again.",
        retryable: true,
      },
    });
  });
});
