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
  return new Response(
    JSON.stringify({
      success: emailStatus !== "failed",
      type:
        emailStatus === "sent" ? "email_confirmation" : "service_error",
      reply: "The email workflow completed.",
      sessionId,
      action: "email_brief",
      ...(emailStatus ? { emailStatus } : {}),
    }),
    { status: 200, headers: { "content-type": "application/json" } },
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

    expect(store.getState().email).toMatchObject({
      status: "success",
      maskedRecipient: "ale••@example.com",
      error: null,
    });
  });

  it("does not infer delivery success from a reply-only response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(emailResponse()),
    );
    const store = createReadyStore();

    await store.dispatch(sendBriefEmail());

    expect(store.getState().email.status).toBe("neutral");
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
});
