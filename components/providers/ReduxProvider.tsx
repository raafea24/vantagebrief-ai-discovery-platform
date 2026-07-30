"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import {
  hydrateSession,
  initialSessionState,
} from "@/store/features/session/sessionSlice";
import {
  hydrateUser,
  initialUserState,
} from "@/store/features/user/userSlice";
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

    return subscribeToWorkspacePersistence(store, window.localStorage);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
