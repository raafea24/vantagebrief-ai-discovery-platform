import { describe, expect, it } from "vitest";
import { mockChatTransport } from "./mockChatTransport";

describe("mockChatTransport", () => {
  it("returns the same typed first-turn response for the same context", async () => {
    const request = {
      sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
      user: {
        fullName: "Alex Morgan",
        companyName: "Acme Solutions",
        email: "alex@acme.example",
        role: "operations" as const,
        challenge: "Reporting is too slow.",
      },
      messages: [
        {
          id: "1ea93e4f-842a-46d4-bd86-7d5b8342a8ee",
          sender: "user" as const,
          content: "Our reporting handoffs are unclear.",
          createdAt: "2026-07-31T08:00:00.000Z",
          status: "sent" as const,
        },
      ],
    };

    const [first, second] = await Promise.all([
      mockChatTransport.send(request),
      mockChatTransport.send(request),
    ]);

    expect(first).toEqual(second);
    expect(first.briefPatch?.primaryChallenge).toBe(
      "Our reporting handoffs are unclear.",
    );
  });
});
