import { z } from "zod";
import type { AppStore, RootState } from "@/store";
import { onboardingSchema } from "@/lib/schemas/onboardingSchema";
import type { SessionState, UserState } from "@/types/workspace";

export const WORKSPACE_STORAGE_KEY = "vantagebrief.workspace.v1";

const persistedUserSchema = onboardingSchema.extend({
  onboardingCompleted: z.literal(true),
});

const persistedSessionSchema = z.object({
  sessionId: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  status: z.literal("active"),
  hydrationStatus: z.literal("ready"),
});

const persistedWorkspaceSchema = z.object({
  version: z.literal(1),
  user: persistedUserSchema,
  session: persistedSessionSchema,
});

export interface PersistedWorkspaceState {
  version: 1;
  user: UserState;
  session: SessionState;
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
    !state.user.onboardingCompleted ||
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
