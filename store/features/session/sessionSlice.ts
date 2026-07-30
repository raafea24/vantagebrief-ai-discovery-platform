import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionState } from "@/types/workspace";

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
    resetSession() {
      return {
        ...initialSessionState,
        hydrationStatus: "ready" as const,
      };
    },
  },
});

export const {
  createSession,
  hydrateSession,
  resetSession,
  setHydrationStatus,
} = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;
