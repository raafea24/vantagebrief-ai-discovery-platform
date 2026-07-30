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
  readPersistedWorkspace,
  subscribeToWorkspacePersistence,
} from "@/store/persistence";

export function ReduxProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [store] = useState(makeStore);

  useEffect(() => {
    const persistedState = readPersistedWorkspace(window.localStorage);

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

    return subscribeToWorkspacePersistence(store, window.localStorage);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
