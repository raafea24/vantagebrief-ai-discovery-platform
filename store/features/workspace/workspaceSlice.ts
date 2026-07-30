import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  DiscoveryStage,
  WorkspaceMode,
  WorkspaceState,
} from "@/types/workspace";

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
});

export const {
  hydrateWorkspace,
  resetWorkspace,
  setDiscoveryStage,
  setWorkspaceMode,
} = workspaceSlice.actions;

export const workspaceReducer = workspaceSlice.reducer;
