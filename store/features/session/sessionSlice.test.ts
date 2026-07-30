import { describe, expect, it } from "vitest";
import {
  createSession,
  initialSessionState,
  sessionReducer,
} from "./sessionSlice";

describe("sessionSlice", () => {
  it("creates an active, hydrated discovery session", () => {
    const timestamp = "2026-07-31T08:00:00.000Z";
    const state = sessionReducer(
      initialSessionState,
      createSession({
        sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
        timestamp,
      }),
    );

    expect(state).toEqual({
      sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
      createdAt: timestamp,
      updatedAt: timestamp,
      status: "active",
      hydrationStatus: "ready",
    });
  });
});
