import { describe, expect, it, vi } from "vitest";
import {
  readPersistedWorkspace,
  WORKSPACE_STORAGE_KEY,
} from "./persistence";

describe("workspace persistence", () => {
  it("restores a valid versioned onboarding record", () => {
    const record = {
      version: 1,
      user: {
        fullName: "Alex Morgan",
        companyName: "Acme Solutions",
        email: "alex@acmesolutions.com",
        role: "operations",
        challenge: "We need to improve coordination across our current workflow.",
        onboardingCompleted: true,
      },
      session: {
        sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
        createdAt: "2026-07-31T08:00:00.000Z",
        updatedAt: "2026-07-31T08:00:00.000Z",
        status: "active",
        hydrationStatus: "ready",
      },
    };
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(record)),
      removeItem: vi.fn(),
    };

    expect(readPersistedWorkspace(storage)).toEqual(record);
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it("does not restore a transient request action", () => {
    const record = {
      version: 1,
      user: {
        fullName: "Alex Morgan",
        companyName: "Acme Solutions",
        email: "alex@acmesolutions.com",
        role: "operations",
        challenge: "We need to improve coordination.",
        onboardingCompleted: true,
      },
      session: {
        sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
        createdAt: "2026-07-31T08:00:00.000Z",
        updatedAt: "2026-07-31T08:00:00.000Z",
        status: "active",
        hydrationStatus: "ready",
      },
      conversation: {
        draft: "",
        messages: [],
        requestStatus: "idle",
        pendingRequestId: null,
        failedRequest: null,
        action: "email_brief",
      },
    };
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(record)),
      removeItem: vi.fn(),
    };

    const restored = readPersistedWorkspace(storage);

    expect(restored?.conversation).not.toHaveProperty("action");
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it("removes corrupt or invalid saved data", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue('{"version":2}'),
      removeItem: vi.fn(),
    };

    expect(readPersistedWorkspace(storage)).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith(WORKSPACE_STORAGE_KEY);
  });

  it("migrates the approved empty-state record into the active message model", () => {
    const record = {
      version: 1,
      user: {
        fullName: "Alex Morgan",
        companyName: "Acme Solutions",
        email: "alex@acmesolutions.com",
        role: "operations",
        challenge: "We need to improve coordination.",
        onboardingCompleted: true,
      },
      session: {
        sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
        createdAt: "2026-07-31T08:00:00.000Z",
        updatedAt: "2026-07-31T08:00:00.000Z",
        status: "active",
        hydrationStatus: "ready",
      },
      workspace: {
        mode: "initiated",
        discoveryStage: "challenge",
      },
      conversation: {
        draft: "",
        firstMessage: {
          id: "1ea93e4f-842a-46d4-bd86-7d5b8342a8ee",
          content: "Where is our current process slowing down?",
          createdAt: "2026-07-31T08:00:00.000Z",
        },
      },
      brief: {
        status: "not_started",
        sections: {
          businessContext: "available",
          primaryChallenge: "current",
          currentWorkflow: "pending",
          requirements: "pending",
          recommendedDirection: "pending",
          openQuestions: "pending",
          nextStep: "pending",
        },
      },
    };
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(record)),
      removeItem: vi.fn(),
    };

    const restored = readPersistedWorkspace(storage);

    expect(restored?.workspace?.mode).toBe("active");
    expect(restored?.conversation?.messages).toEqual([
      {
        ...record.conversation.firstMessage,
        sender: "user",
        status: "sent",
      },
    ]);
    expect(restored?.brief?.status).toBe("pending");
  });
});
