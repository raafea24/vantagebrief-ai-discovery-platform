import type {
  BriefPatch,
  ConversationMessage,
  OnboardingProfile,
} from "@/types/workspace";

export interface ChatTransportRequest {
  sessionId: string;
  user: OnboardingProfile;
  messages: ConversationMessage[];
}

export interface ChatTransportResult {
  reply: string;
  briefPatch?: BriefPatch;
}

export interface ChatTransport {
  send(request: ChatTransportRequest): Promise<ChatTransportResult>;
}
