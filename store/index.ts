import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "@/store/api/chatApi";
import { briefReducer } from "@/store/features/brief/briefSlice";
import { conversationReducer } from "@/store/features/conversation/conversationSlice";
import { emailReducer } from "@/store/features/email/emailSlice";
import { sessionReducer } from "@/store/features/session/sessionSlice";
import { userReducer } from "@/store/features/user/userSlice";
import { workspaceReducer } from "@/store/features/workspace/workspaceSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      session: sessionReducer,
      workspace: workspaceReducer,
      conversation: conversationReducer,
      brief: briefReducer,
      email: emailReducer,
      [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(chatApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
