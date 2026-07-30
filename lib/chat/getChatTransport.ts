import type { ChatTransport } from "@/types/chat";

const unavailableTransport: ChatTransport = {
  async send() {
    throw new Error("CHAT_TRANSPORT_UNAVAILABLE");
  },
};

export async function getChatTransport(): Promise<ChatTransport> {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    const { mockChatTransport } = await import("./mockChatTransport");
    return mockChatTransport;
  }

  return unavailableTransport;
}
