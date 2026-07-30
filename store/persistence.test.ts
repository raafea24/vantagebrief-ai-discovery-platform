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

  it("removes corrupt or invalid saved data", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue('{"version":2}'),
      removeItem: vi.fn(),
    };

    expect(readPersistedWorkspace(storage)).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith(WORKSPACE_STORAGE_KEY);
  });
});
