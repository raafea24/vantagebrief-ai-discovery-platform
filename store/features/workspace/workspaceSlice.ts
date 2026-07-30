import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  DiscoveryStage,
  WorkspaceMode,
  WorkspaceState,
} from "@/types/workspace";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";

export const initialWorkspaceState: WorkspaceState = {
  mode: "empty",
  discoveryStage: "challenge",
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: initialWorkspaceState,
  reducers: {
    setWorkspaceMode(state, action: PayloadAction<WorkspaceMode>) {
      state.mode = action.payload;
    },
    setDiscoveryStage(state, action: PayloadAction<DiscoveryStage>) {
      state.discoveryStage = action.payload;
    },
    hydrateWorkspace(_state, action: PayloadAction<WorkspaceState>) {
      return action.payload;
    },
    resetWorkspace() {
      return initialWorkspaceState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendConversationMessage.pending, (state) => {
        state.mode = "active";
      })
      .addCase(sendConversationMessage.fulfilled, (state, action) => {
        const patch = action.payload.briefPatch;

        if (patch?.recommendedDirection) {
          state.discoveryStage = "direction";
        } else if (patch?.requirements?.length) {
          state.discoveryStage = "requirements";
        } else if (patch?.currentWorkflow?.length) {
          state.discoveryStage = "workflow";
        } else {
          state.discoveryStage = "challenge";
        }
      });
  },
});

export const {
  hydrateWorkspace,
  resetWorkspace,
  setDiscoveryStage,
  setWorkspaceMode,
} = workspaceSlice.actions;

export const workspaceReducer = workspaceSlice.reducer;
