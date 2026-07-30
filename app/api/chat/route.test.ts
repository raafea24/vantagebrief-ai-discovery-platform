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
