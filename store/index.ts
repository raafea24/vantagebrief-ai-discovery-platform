import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "@/store/api/chatApi";
import { sessionReducer } from "@/store/features/session/sessionSlice";
import { userReducer } from "@/store/features/user/userSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      session: sessionReducer,
      [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(chatApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
