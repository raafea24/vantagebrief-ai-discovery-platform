import type {
  ChatTransport,
  ChatTransportRequest,
  ChatTransportResult,
} from "@/types/chat";

const mockReplies = [
  "Thanks — that gives us a useful starting point. What happens immediately before and after this part of the workflow?",
  "That helps clarify the current process. Which handoff creates the most uncertainty or delay?",
  "I have captured that requirement. What constraint should shape the direction we consider next?",
  "That adds useful decision context. What outcome would tell you the new approach is working?",
] as const;

function createDeterministicResult(
  request: ChatTransportRequest,
): ChatTransportResult {
  const userMessages = request.messages.filter(
    (message) => message.sender === "user",
  );
  const latestMessage = userMessages.at(-1)?.content ?? request.user.challenge;
  const turn = Math.max(0, userMessages.length - 1);

  if (turn === 0) {
    return {
      reply: mockReplies[0],
      briefPatch: {
        businessContext: `${request.user.companyName} shared this starting context: ${request.user.challenge}`,
        primaryChallenge: latestMessage,
        openQuestions: [
          "What happens immediately before and after this part of the workflow?",
        ],
      },
    };
  }

  if (turn === 1) {
    return {
      reply: mockReplies[1],
      briefPatch: {
        currentWorkflow: [latestMessage],
        openQuestions: [
          "Which handoff creates the most uncertainty or delay?",
        ],
      },
    };
  }

  if (turn === 2) {
    return {
      reply: mockReplies[2],
      briefPatch: {
        requirements: [latestMessage],
        openQuestions: [
          "What constraint should shape the direction we consider next?",
        ],
      },
    };
  }

  return {
    reply: mockReplies[3],
    briefPatch: {
      recommendedDirection:
        "Review the confirmed workflow and constraints before selecting an implementation approach.",
      nextStep:
        "Confirm the desired outcome and review the current workflow with the people involved.",
      openQuestions: [
        "What outcome would tell you the new approach is working?",
      ],
    },
  };
}

/**
 * Temporary Phase 4 development adapter.
 * Phase 5 replaces this through the same ChatTransport interface.
 */
export const mockChatTransport: ChatTransport = {
  async send(request) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return createDeterministicResult(request);
  },
};
