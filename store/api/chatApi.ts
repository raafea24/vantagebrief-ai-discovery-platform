import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { chatApiResponseSchema } from "@/lib/schemas/chatSchema";
import type { ChatApiRequest, ChatApiResponse } from "@/types/chat";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "test" ? "http://localhost/api" : "/api",
  }),
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation<ChatApiResponse, ChatApiRequest>({
      query: (body) => ({
        url: "/chat",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) =>
        chatApiResponseSchema.parse(response),
    }),
  }),
});

export const { useSendChatMessageMutation } = chatApi;
