"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import {
  hydrateBrief,
  initialBriefState,
} from "@/store/features/brief/briefSlice";
import {
  hydrateConversation,
  initialConversationState,
} from "@/store/features/conversation/conversationSlice";
import {
  hydrateSession,
  initialSessionState,
} from "@/store/features/session/sessionSlice";
import {
  hydrateUser,
  initialUserState,
} from "@/store/features/user/userSlice";
import {
  hydrateWorkspace,
  initialWorkspaceState,
} from "@/store/features/workspace/workspaceSlice";
import {
  hydrateEmail,
  initialEmailState,
} from "@/store/features/email/emailSlice";
import {
  WORKSPACE_STORAGE_KEY,
  readPersistedWorkspace,
  subscribeToWorkspacePersistence,
} from "@/store/persistence";

export function ReduxProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [store] = useState(makeStore);

  useEffect(() => {
    const sessionState = readPersistedWorkspace(window.sessionStorage);
    const legacyState = sessionState
      ? null
      : readPersistedWorkspace(window.localStorage);
    const persistedState = sessionState ?? legacyState;

    if (legacyState) {
      window.sessionStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        JSON.stringify(legacyState),
      );
    }
    // Remove data left by earlier builds even when a tab-scoped copy exists.
    window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);

    store.dispatch(hydrateUser(persistedState?.user ?? initialUserState));
    store.dispatch(
      hydrateSession(
        persistedState?.session ?? {
          ...initialSessionState,
          hydrationStatus: "ready",
        },
      ),
    );
    store.dispatch(
      hydrateWorkspace(persistedState?.workspace ?? initialWorkspaceState),
    );
    store.dispatch(
      hydrateConversation(
        persistedState?.conversation ?? initialConversationState,
      ),
    );
    store.dispatch(hydrateBrief(persistedState?.brief ?? initialBriefState));
    store.dispatch(hydrateEmail(persistedState?.email ?? initialEmailState));

    return subscribeToWorkspacePersistence(store, window.sessionStorage);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
