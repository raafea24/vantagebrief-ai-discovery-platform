import { afterEach, describe, expect, it, vi } from "vitest";
import { makeStore } from "@/store";
import { hydrateSession } from "@/store/features/session/sessionSlice";
import { hydrateUser } from "@/store/features/user/userSlice";
import { sendBriefEmail } from "./emailThunks";

const sessionId = "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e";

function createReadyStore() {
  const store = makeStore();

  store.dispatch(
    hydrateUser({
      fullName: "Alex Morgan",
      companyName: "Acme Solutions",
      email: "alex@example.com",
      role: "operations",
      challenge: "Reporting takes too long.",
      onboardingCompleted: true,
    }),
  );
  store.dispatch(
    hydrateSession({
      sessionId,
      createdAt: "2026-07-31T08:00:00.000Z",
      updatedAt: "2026-07-31T08:00:00.000Z",
      status: "active",
      hydrationStatus: "ready",
    }),
  );

  return store;
}

function emailResponse(emailStatus?: "sent" | "failed") {
  const sent = emailStatus === "sent";
  const failed = emailStatus === "failed";

  return new Response(
    JSON.stringify({
      httpStatus: failed ? 502 : 200,
      success: !failed,
      type: sent
        ? "email_confirmation"
        : failed
          ? "service_error"
          : "chat_response",
      reply: sent
        ? "Your Opportunity Brief has been sent to your email."
        : failed
          ? "The brief could not be emailed. Please try again."
          : "The request was processed.",
      sessionId,
      action: "email_brief",
      ...(emailStatus ? { emailStatus } : {}),
      ...(sent
        ? { emailMessage: "The Opportunity Brief was emailed successfully." }
        : failed
          ? { emailMessage: "The Opportunity Brief could not be emailed." }
          : {}),
    }),
    {
      status: failed ? 502 : 200,
      headers: { "content-type": "application/json" },
    },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("emailSlice", () => {
  it("prevents duplicate email submissions while processing", async () => {
    let resolveResponse: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveResponse = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const store = createReadyStore();

    const firstRequest = store.dispatch(sendBriefEmail());
    const duplicateRequest = await store.dispatch(sendBriefEmail());

    expect(store.getState().email.status).toBe("processing");
    expect(duplicateRequest.meta.requestStatus).toBe("rejected");
    expect(
      "condition" in duplicateRequest.meta && duplicateRequest.meta.condition,
    ).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveResponse?.(emailResponse("sent"));
    await firstRequest;

    const repeatedRequest = await store.dispatch(sendBriefEmail());

    expect(repeatedRequest.meta.requestStatus).toBe("rejected");
    expect(
      "condition" in repeatedRequest.meta && repeatedRequest.meta.condition,
    ).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(store.getState().email).toMatchObject({
      status: "success",
      maskedRecipient: "ale••@example.com",
      error: null,
    });
  });

  it("treats a response without explicit sent status as a failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(emailResponse()),
    );
    const store = createReadyStore();

    await store.dispatch(sendBriefEmail());

    expect(store.getState().email.status).toBe("failed");
  });

  it("stores a retryable failure without changing conversation or brief", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(emailResponse("failed")),
    );
    const store = createReadyStore();
    const conversationBefore = store.getState().conversation;
    const briefBefore = store.getState().brief;

    await store.dispatch(sendBriefEmail());

    expect(store.getState().email.status).toBe("failed");
    expect(store.getState().conversation).toEqual(conversationBefore);
    expect(store.getState().brief).toEqual(briefBefore);
  });

  it("shows a retryable failure after a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("network unavailable")),
    );
    const store = createReadyStore();

    await store.dispatch(sendBriefEmail());

    expect(store.getState().email).toMatchObject({
      status: "failed",
      message: null,
      error:
        "The email request could not be completed. Your conversation and brief are preserved.",
    });
  });
});
