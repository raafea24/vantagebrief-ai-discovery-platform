import { createAsyncThunk } from "@reduxjs/toolkit";
import { createWorkspaceSessionId } from "@/lib/session";
import type { RootState } from "@/store";
import { chatApi } from "@/store/api/chatApi";
import { getSafeChatErrorMessage } from "@/store/api/chatError";
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
  async ({ message }, { dispatch, getState, rejectWithValue }) => {
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
      const result = await dispatch(
        chatApi.endpoints.sendChatMessage.initiate({
          message: message.content,
          sessionId,
          name: state.user.fullName,
          email: state.user.email,
          companyName: state.user.companyName,
          role: state.user.role,
          initialChallenge: state.user.challenge,
        }, { track: false }),
      ).unwrap();

      return {
        userMessageId: message.id,
        assistantMessage: {
          id: createWorkspaceSessionId(),
          sender: "assistant",
          content: result.reply,
          createdAt: new Date().toISOString(),
          status: "sent",
        },
        briefPatch: result.brief,
      };
    } catch (error) {
      return rejectWithValue({
        userMessageId: message.id,
        message: getSafeChatErrorMessage(
          error,
          "VantageBrief could not continue the discovery just now. Your message is preserved.",
        ),
      });
    }
  },
  {
    condition: (_argument, { getState }) =>
      (getState() as RootState).conversation.requestStatus !== "pending",
  },
);
