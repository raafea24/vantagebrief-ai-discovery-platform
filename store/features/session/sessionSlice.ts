import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionState } from "@/types/workspace";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";

export const initialSessionState: SessionState = {
  sessionId: null,
  createdAt: null,
  updatedAt: null,
  status: "idle",
  hydrationStatus: "idle",
};

interface CreateSessionPayload {
  sessionId: string;
  timestamp: string;
}

const sessionSlice = createSlice({
  name: "session",
  initialState: initialSessionState,
  reducers: {
    createSession(state, action: PayloadAction<CreateSessionPayload>) {
      state.sessionId = action.payload.sessionId;
      state.createdAt = action.payload.timestamp;
      state.updatedAt = action.payload.timestamp;
      state.status = "active";
      state.hydrationStatus = "ready";
    },
    hydrateSession(_state, action: PayloadAction<SessionState>) {
      return action.payload;
    },
    setHydrationStatus(
      state,
      action: PayloadAction<SessionState["hydrationStatus"]>,
    ) {
      state.hydrationStatus = action.payload;
    },
    touchSession(state, action: PayloadAction<string>) {
      state.updatedAt = action.payload;
    },
    resetSession() {
      return {
        ...initialSessionState,
        hydrationStatus: "ready" as const,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendConversationMessage.fulfilled, (state, action) => {
      state.updatedAt = action.payload.assistantMessage.createdAt;
    });
  },
});

export const {
  createSession,
  hydrateSession,
  resetSession,
  setHydrationStatus,
  touchSession,
} = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;
