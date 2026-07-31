import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  DiscoveryStage,
  WorkspaceMode,
  WorkspaceState,
} from "@/types/workspace";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";
import { sendBriefEmail } from "@/store/features/email/emailThunks";

export const initialWorkspaceState: WorkspaceState = {
  mode: "empty",
  discoveryStage: "challenge",
  selectedPanel: "conversation",
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
    setSelectedPanel(
      state,
      action: PayloadAction<WorkspaceState["selectedPanel"]>,
    ) {
      state.selectedPanel = action.payload;
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
        updateDiscoveryStage(state, action.payload.briefPatch);
      })
      .addCase(sendBriefEmail.fulfilled, (state, action) => {
        updateDiscoveryStage(state, action.payload.briefPatch);
      });
  },
});

function updateDiscoveryStage(
  state: WorkspaceState,
  patch:
    | {
        currentWorkflow?: string[];
        requirements?: string[];
        recommendedDirection?: string;
        nextStep?: string;
      }
    | undefined,
) {
  if (patch?.nextStep) {
    state.discoveryStage = "brief";
  } else if (patch?.recommendedDirection) {
    state.discoveryStage = "direction";
  } else if (patch?.requirements?.length) {
    state.discoveryStage = "requirements";
  } else if (patch?.currentWorkflow?.length) {
    state.discoveryStage = "workflow";
  } else {
    state.discoveryStage = "challenge";
  }
}

export const {
  hydrateWorkspace,
  resetWorkspace,
  setDiscoveryStage,
  setSelectedPanel,
  setWorkspaceMode,
} = workspaceSlice.actions;

export const workspaceReducer = workspaceSlice.reducer;
