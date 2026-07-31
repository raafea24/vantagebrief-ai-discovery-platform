import { describe, expect, it } from "vitest";
import { briefReducer, initialBriefState } from "./briefSlice";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";

const argument = {
  message: {
    id: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
    content: "Our reporting handoff is unclear.",
    createdAt: "2026-07-31T08:00:00.000Z",
  },
};

function fulfilledAction(
  requestId: string,
  briefPatch: NonNullable<
    Parameters<typeof sendConversationMessage.fulfilled>[0]["briefPatch"]
  >,
) {
  return sendConversationMessage.fulfilled(
    {
      userMessageId: argument.message.id,
      assistantMessage: {
        id: "1ea93e4f-842a-46d4-bd86-7d5b8342a8ee",
        sender: "assistant",
        content: "What happens at that handoff?",
        createdAt: "2026-07-31T08:00:01.000Z",
        status: "sent",
      },
      briefPatch,
    },
    requestId,
    argument,
  );
}

describe("briefSlice", () => {
  it("applies patches without discarding existing brief information", () => {
    const withChallenge = briefReducer(
      initialBriefState,
      fulfilledAction("request-1", {
        primaryChallenge: "Reporting handoffs are unclear.",
        openQuestions: ["Who owns the handoff?"],
      }),
    );
    const withWorkflow = briefReducer(
      withChallenge,
      fulfilledAction("request-2", {
        currentWorkflow: ["A manager manually consolidates reports."],
      }),
    );

    expect(withWorkflow.primaryChallenge.value).toBe(
      "Reporting handoffs are unclear.",
    );
    expect(withWorkflow.primaryChallenge.status).toBe("complete");
    expect(withWorkflow.currentWorkflow.value).toEqual([
      "A manager manually consolidates reports.",
    ]);
    expect(withWorkflow.openQuestions.value).toEqual([
      "Who owns the handoff?",
    ]);
  });

  it("marks incomplete sections as pending and requires real data for completion", () => {
    const partial = briefReducer(
      initialBriefState,
      fulfilledAction("request-partial", {
        primaryChallenge: "Reporting handoffs are unclear.",
        currentWorkflow: ["Analysts consolidate reports manually."],
        requirements: ["Clarify report ownership."],
        recommendedDirection: "Define one accountable report owner.",
        nextStep: "Review the proposed ownership model.",
      }),
    );

    expect(partial.status).toBe("current");
    expect(partial.businessContext.status).toBe("current");
    expect(partial.openQuestions.status).toBe("pending");

    const complete = briefReducer(
      partial,
      fulfilledAction("request-complete", {
        businessContext: "Acme prepares weekly operational reports.",
      }),
    );

    expect(complete.status).toBe("complete");
    expect(complete.businessContext.status).toBe("complete");
    expect(complete.nextStep.status).toBe("complete");
    expect(complete.openQuestions.status).toBe("pending");
  });

  it("merges list patches without deleting or duplicating existing values", () => {
    const first = briefReducer(
      initialBriefState,
      fulfilledAction("request-list-1", {
        requirements: ["Clarify ownership."],
        openQuestions: ["Who owns the current approval?"],
      }),
    );
    const second = briefReducer(
      first,
      fulfilledAction("request-list-2", {
        requirements: ["Clarify ownership.", "Define approval timing."],
        openQuestions: [
          "Who owns the current approval?",
          "When does finance review it?",
        ],
      }),
    );

    expect(second.requirements.value).toEqual([
      "Clarify ownership.",
      "Define approval timing.",
    ]);
    expect(second.openQuestions.value).toEqual([
      "Who owns the current approval?",
      "When does finance review it?",
    ]);
  });
});
