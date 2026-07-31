import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { sendN8nChatRequest } from "./n8nClient";

const request = {
  message: "Our reporting handoff is unclear.",
  sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
  name: "Alex Morgan",
  email: "alex@example.com",
  companyName: "Acme Solutions",
  role: "operations" as const,
  initialChallenge: "Reporting takes too long.",
};

const completeBrief = {
  businessContext: "Acme prepares monthly operational reports.",
  primaryChallenge: "Reporting handoffs are unclear.",
  currentWorkflow: ["Analysts consolidate reports manually."],
  requirements: ["Centralize reporting inputs."],
  recommendedDirection: "Map and simplify the reporting workflow.",
  openQuestions: ["Which report should be piloted first?"],
  nextStep: "Run a workflow-mapping session.",
};

const emailRequest = {
  message: "Send the current Opportunity Brief.",
  sessionId: request.sessionId,
  userName: "Alex Morgan",
  userEmail: "alex@example.com",
  companyName: request.companyName,
  role: request.role,
  initialChallenge: request.initialChallenge,
  action: "email_brief" as const,
  brief: completeBrief,
};

function setTestEnvironment(timeout = "60000") {
  process.env.N8N_WEBHOOK_URL = "https://automation.example/webhook/chat";
  process.env.N8N_WEBHOOK_SECRET = "test-secret";
  process.env.N8N_WEBHOOK_HEADER_NAME = "x-vantagebrief-key";
  process.env.N8N_REQUEST_TIMEOUT_MS = timeout;
}

beforeEach(() => {
  setTestEnvironment();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.N8N_WEBHOOK_URL;
  delete process.env.N8N_WEBHOOK_SECRET;
  delete process.env.N8N_WEBHOOK_HEADER_NAME;
  delete process.env.N8N_REQUEST_TIMEOUT_MS;
});

describe("sendN8nChatRequest", () => {
  it("keeps authentication server-side and normalizes a structured response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          type: "chat_response",
          reply: "Who currently approves the final report?",
          sessionId: request.sessionId,
          brief: {
            businessContext: {
              status: "identified",
              value: "Acme prepares operational reports.",
            },
            currentChallenge: {
              status: "identified",
              value: "Reporting handoffs are unclear.",
            },
            existingWorkflow: {
              status: "in_progress",
              value: "Analysts consolidate reports manually.",
            },
            openQuestions: {
              status: "identified",
              values: ["Who approves the final report?"],
            },
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendN8nChatRequest(request);

    expect(result.brief).toEqual({
      businessContext: "Acme prepares operational reports.",
      primaryChallenge: "Reporting handoffs are unclear.",
      currentWorkflow: ["Analysts consolidate reports manually."],
      openQuestions: ["Who approves the final report?"],
    });

    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://automation.example/webhook/chat");
    expect(new Headers(options.headers).get("x-vantagebrief-key")).toBe(
      "test-secret",
    );
    expect(JSON.parse(options.body as string)).toMatchObject({
      ...request,
      action: "chat",
      metadata: {
        source: "vantagebrief-web",
      },
    });
  });

  it("supports a valid reply without structured brief data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            type: "chat_response",
            reply: "What happens after the report is approved?",
            sessionId: request.sessionId,
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(sendN8nChatRequest(request)).resolves.toEqual({
      success: true,
      type: "chat_response",
      reply: "What happens after the report is approved?",
      sessionId: request.sessionId,
      action: "chat",
    });
  });

  it("forwards an email action and requires explicit delivery status", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          httpStatus: 200,
          success: true,
          type: "email_confirmation",
          action: "email_brief",
          reply: "Your Opportunity Brief has been sent to your email.",
          sessionId: request.sessionId,
          emailStatus: "sent",
          emailMessage: "The Opportunity Brief was emailed successfully.",
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendN8nChatRequest(emailRequest),
    ).resolves.toMatchObject({
      httpStatus: 200,
      success: true,
      type: "email_confirmation",
      action: "email_brief",
      emailStatus: "sent",
      emailMessage: "The Opportunity Brief was emailed successfully.",
    });

    const payload = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(payload).toMatchObject({
      ...emailRequest,
      brief: completeBrief,
    });
    expect(payload).not.toHaveProperty("name");
    expect(payload).not.toHaveProperty("email");
  });

  it("normalizes the production email failure contract", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            httpStatus: 502,
            success: false,
            type: "service_error",
            action: "email_brief",
            emailStatus: "failed",
            emailMessage: "The Opportunity Brief could not be emailed.",
            reply: "The brief could not be emailed. Please try again.",
            sessionId: request.sessionId,
          }),
          { status: 502 },
        ),
      ),
    );

    await expect(sendN8nChatRequest(emailRequest)).resolves.toEqual({
      httpStatus: 502,
      success: false,
      type: "service_error",
      action: "email_brief",
      emailStatus: "failed",
      emailMessage: "The Opportunity Brief could not be emailed.",
      reply: "The brief could not be emailed. Please try again.",
      sessionId: request.sessionId,
    });
  });

  it("rejects malformed email confirmation responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            httpStatus: 200,
            success: true,
            type: "email_confirmation",
            action: "email_brief",
            reply: "The email workflow completed.",
            sessionId: request.sessionId,
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(sendN8nChatRequest(emailRequest)).rejects.toMatchObject({
      kind: "malformed_response",
    });
  });

  it("rejects webhook failures and malformed responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ reply: "Missing response fields" }), {
          status: 200,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendN8nChatRequest(request)).rejects.toMatchObject({
      kind: "webhook",
    });
    await expect(sendN8nChatRequest(request)).rejects.toMatchObject({
      kind: "malformed_response",
    });
  });

  it("aborts a request after the configured timeout", async () => {
    vi.useFakeTimers();
    setTestEnvironment("1000");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, options: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            options.signal?.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"));
            });
          }),
      ),
    );

    const result = expect(
      sendN8nChatRequest(request),
    ).rejects.toMatchObject({
      kind: "timeout",
    });
    await vi.advanceTimersByTimeAsync(1000);

    await result;
  });

  it("normalizes network failures without exposing request details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("connection failed")),
    );

    await expect(sendN8nChatRequest(emailRequest)).rejects.toMatchObject({
      kind: "network",
    });
  });
});
