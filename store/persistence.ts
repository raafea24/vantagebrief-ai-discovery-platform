import { z } from "zod";
import type { AppStore, RootState } from "@/store";
import { onboardingSchema } from "@/lib/schemas/onboardingSchema";
import type {
  BriefState,
  ConversationState,
  SessionState,
  UserState,
  WorkspaceState,
} from "@/types/workspace";

export const WORKSPACE_STORAGE_KEY = "vantagebrief.workspace.v1";

const persistedUserSchema = onboardingSchema.extend({
  onboardingCompleted: z.boolean(),
});

const persistedSessionSchema = z.object({
  sessionId: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  status: z.literal("active"),
  hydrationStatus: z.literal("ready"),
});

const persistedWorkspaceUiSchema = z.object({
  mode: z.enum(["empty", "initiated"]),
  discoveryStage: z.enum([
    "context",
    "challenge",
    "workflow",
    "requirements",
    "direction",
    "brief",
  ]),
});

const persistedConversationSchema = z.object({
  draft: z.string().max(4000),
  firstMessage: z
    .object({
      id: z.uuid(),
      content: z.string().trim().min(1).max(4000),
      createdAt: z.iso.datetime(),
    })
    .nullable(),
});

const persistedBriefSchema = z.object({
  status: z.literal("not_started"),
  sections: z.object({
    businessContext: z.literal("available"),
    primaryChallenge: z.enum(["current", "pending"]),
    currentWorkflow: z.literal("pending"),
    requirements: z.literal("pending"),
    recommendedDirection: z.literal("pending"),
    openQuestions: z.literal("pending"),
    nextStep: z.literal("pending"),
  }),
});

const persistedWorkspaceSchema = z.object({
  version: z.literal(1),
  user: persistedUserSchema,
  session: persistedSessionSchema,
  workspace: persistedWorkspaceUiSchema.optional(),
  conversation: persistedConversationSchema.optional(),
  brief: persistedBriefSchema.optional(),
});

export interface PersistedWorkspaceState {
  version: 1;
  user: UserState;
  session: SessionState;
  workspace?: WorkspaceState;
  conversation?: ConversationState;
  brief?: BriefState;
}

export function readPersistedWorkspace(
  storage: Pick<Storage, "getItem" | "removeItem">,
): PersistedWorkspaceState | null {
  const storedValue = storage.getItem(WORKSPACE_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const result = persistedWorkspaceSchema.safeParse(JSON.parse(storedValue));

    if (!result.success) {
      storage.removeItem(WORKSPACE_STORAGE_KEY);
      return null;
    }

    return result.data;
  } catch {
    storage.removeItem(WORKSPACE_STORAGE_KEY);
    return null;
  }
}

function createPersistedWorkspace(
  state: RootState,
): PersistedWorkspaceState | null {
  if (
    !state.session.sessionId ||
    !state.session.createdAt ||
    !state.session.updatedAt ||
    state.session.status !== "active" ||
    state.session.hydrationStatus !== "ready"
  ) {
    return null;
  }

  const candidate = {
    version: 1 as const,
    user: state.user,
    session: state.session,
    workspace: state.workspace,
    conversation: state.conversation,
    brief: state.brief,
  };
  const result = persistedWorkspaceSchema.safeParse(candidate);

  return result.success ? result.data : null;
}

export function subscribeToWorkspacePersistence(
  store: AppStore,
  storage: Pick<Storage, "setItem">,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let previousValue = "";

  const unsubscribe = store.subscribe(() => {
    const persistedState = createPersistedWorkspace(store.getState());

    if (!persistedState) {
      return;
    }

    const nextValue = JSON.stringify(persistedState);

    if (nextValue === previousValue) {
      return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      storage.setItem(WORKSPACE_STORAGE_KEY, nextValue);
      previousValue = nextValue;
    }, 80);
  });

  return () => {
    clearTimeout(timeout);
    unsubscribe();
  };
}
