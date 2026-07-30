import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChatTransport } from "@/lib/chat/getChatTransport";
import { createWorkspaceSessionId } from "@/lib/session";
import type { RootState } from "@/store";
import type {
  BriefPatch,
  ConversationMessage,
  LocalUserMessage,
} from "@/types/workspace";

export interface SendMessageArgument {
  message: LocalUserMessage;
  retry?: boolean;
}

interface SendMessageResult {
  userMessageId: string;
  assistantMessage: ConversationMessage;
  briefPatch?: BriefPatch;
}

interface SendMessageFailure {
  userMessageId: string;
  message: string;
}

export const sendConversationMessage = createAsyncThunk<
  SendMessageResult,
  SendMessageArgument,
  { state: RootState; rejectValue: SendMessageFailure }
>(
  "conversation/sendMessage",
  async ({ message }, { getState, rejectWithValue }) => {
    const state = getState();
    const sessionId = state.session.sessionId;

    if (!sessionId) {
      return rejectWithValue({
        userMessageId: message.id,
        message:
          "Your local discovery session is unavailable. Reopen the workspace and try again.",
      });
    }

    try {
      const transport = await getChatTransport();
      const messages = [
        ...state.conversation.messages.filter(
          (existingMessage) => existingMessage.id !== message.id,
        ),
        {
          ...message,
          sender: "user" as const,
          status: "sent" as const,
        },
      ];
      const result = await transport.send({
        sessionId,
        user: {
          fullName: state.user.fullName,
          companyName: state.user.companyName,
          email: state.user.email,
          role: state.user.role,
          challenge: state.user.challenge,
        },
        messages,
      });

      return {
        userMessageId: message.id,
        assistantMessage: {
          id: createWorkspaceSessionId(),
          sender: "assistant",
          content: result.reply,
          createdAt: new Date().toISOString(),
          status: "sent",
        },
        briefPatch: result.briefPatch,
      };
    } catch {
      return rejectWithValue({
        userMessageId: message.id,
        message:
          "VantageBrief could not continue the discovery just now. Your message is preserved.",
      });
    }
  },
  {
    condition: (_argument, { getState }) =>
      (getState() as RootState).conversation.requestStatus !== "pending",
  },
);
