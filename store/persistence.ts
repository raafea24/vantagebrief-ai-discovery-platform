import { z } from "zod";
import type { AppStore, RootState } from "@/store";
import { onboardingSchema } from "@/lib/schemas/onboardingSchema";
import type {
  BriefState,
  ConversationState,
  EmailState,
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
  mode: z.enum(["empty", "active"]),
  discoveryStage: z.enum([
    "context",
    "challenge",
    "workflow",
    "requirements",
    "direction",
    "brief",
  ]),
  selectedPanel: z.enum(["conversation", "brief"]).default("conversation"),
});

const legacyWorkspaceUiSchema = z
  .object({
    mode: z.enum(["empty", "initiated"]),
    discoveryStage: persistedWorkspaceUiSchema.shape.discoveryStage,
  })
  .transform((workspace): WorkspaceState => ({
    mode: workspace.mode === "initiated" ? "active" : "empty",
    discoveryStage: workspace.discoveryStage,
    selectedPanel: "conversation",
  }));

const persistedMessageSchema = z.object({
  id: z.uuid(),
  sender: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
  createdAt: z.iso.datetime(),
  status: z.enum(["sent", "failed"]),
});

const persistedConversationSchema = z.object({
  draft: z.string().max(4000),
  messages: z.array(persistedMessageSchema).max(200),
  requestStatus: z.enum(["idle", "failed"]),
  pendingRequestId: z.null(),
  failedRequest: z
    .object({
      messageId: z.uuid(),
      message: z.string().min(1).max(300),
    })
    .nullable(),
});

const legacyConversationSchema = z
  .object({
    draft: z.string().max(4000),
    firstMessage: z
      .object({
        id: z.uuid(),
        content: z.string().trim().min(1).max(4000),
        createdAt: z.iso.datetime(),
      })
      .nullable(),
  })
  .transform(
    (conversation): ConversationState => ({
      draft: conversation.draft,
      messages: conversation.firstMessage
        ? [
            {
              ...conversation.firstMessage,
              sender: "user",
              status: "sent",
            },
          ]
        : [],
      requestStatus: "idle",
      pendingRequestId: null,
      failedRequest: null,
    }),
  );

const briefStatusSchema = z.enum(["complete", "current", "pending"]);
const nullableTextFieldSchema = z.object({
  value: z.string().max(4000).nullable(),
  status: briefStatusSchema,
});
const listFieldSchema = z.object({
  value: z.array(z.string().max(1000)).max(30),
  status: briefStatusSchema,
});

const persistedBriefSchema = z.object({
  status: briefStatusSchema,
  businessContext: nullableTextFieldSchema,
  primaryChallenge: nullableTextFieldSchema,
  currentWorkflow: listFieldSchema,
  requirements: listFieldSchema,
  recommendedDirection: nullableTextFieldSchema,
  openQuestions: listFieldSchema,
  nextStep: nullableTextFieldSchema,
});

const persistedEmailSchema = z
  .object({
    status: z.enum(["idle", "success", "updated", "failed"]),
    maskedRecipient: z.string().max(254).nullable(),
    confirmedRecipient: z.string().email().max(254).nullable(),
    message: z.string().max(500).nullable(),
    error: z.string().max(500).nullable(),
    sentBriefFingerprint: z.string().max(20_000).nullable(),
  })
  .refine(
    (email) =>
      email.status !== "success" ||
      Boolean(email.confirmedRecipient && email.sentBriefFingerprint),
    { message: "Confirmed email state is incomplete." },
  );

const legacyBriefSchema = z
  .object({
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
  })
  .transform(
    (): BriefState => ({
      status: "pending",
      businessContext: { value: null, status: "complete" },
      primaryChallenge: { value: null, status: "current" },
      currentWorkflow: { value: [], status: "pending" },
      requirements: { value: [], status: "pending" },
      recommendedDirection: { value: null, status: "pending" },
      openQuestions: { value: [], status: "pending" },
      nextStep: { value: null, status: "pending" },
    }),
  );

const persistedWorkspaceSchema = z.object({
  version: z.literal(1),
  user: persistedUserSchema,
  session: persistedSessionSchema,
  workspace: z
    .union([persistedWorkspaceUiSchema, legacyWorkspaceUiSchema])
    .optional(),
  conversation: z
    .union([persistedConversationSchema, legacyConversationSchema])
    .optional(),
  brief: z.union([persistedBriefSchema, legacyBriefSchema]).optional(),
  email: persistedEmailSchema.optional(),
});

export interface PersistedWorkspaceState {
  version: 1;
  user: UserState;
  session: SessionState;
  workspace?: WorkspaceState;
  conversation?: ConversationState;
  brief?: BriefState;
  email?: EmailState;
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

  const interruptedMessage = state.conversation.messages.find(
    (message) => message.status === "pending",
  );
  const failedRequest =
    state.conversation.failedRequest ??
    (interruptedMessage
      ? {
          messageId: interruptedMessage.id,
          message:
            "The previous request was interrupted. Your message is preserved.",
        }
      : null);
  const candidate = {
    version: 1 as const,
    user: state.user,
    session: state.session,
    workspace: state.workspace,
    conversation: {
      draft: state.conversation.draft,
      messages: state.conversation.messages.map((message) => ({
        ...message,
        status: message.status === "pending" ? ("failed" as const) : message.status,
      })),
      requestStatus: failedRequest ? ("failed" as const) : ("idle" as const),
      pendingRequestId: null,
      failedRequest,
    },
    brief: state.brief,
    email: {
      ...state.email,
      status:
        state.email.status === "processing" ? "failed" : state.email.status,
      error:
        state.email.status === "processing"
          ? "The previous email request was interrupted. Please try again."
          : state.email.error,
    },
  };
  const result = persistedWorkspaceSchema.safeParse(candidate);

  return result.success ? result.data : null;
}

export function subscribeToWorkspacePersistence(
  store: AppStore,
  storage: Pick<Storage, "setItem" | "removeItem">,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let previousValue = "";

  const unsubscribe = store.subscribe(() => {
    const persistedState = createPersistedWorkspace(store.getState());

    if (!persistedState) {
      clearTimeout(timeout);
      storage.removeItem(WORKSPACE_STORAGE_KEY);
      previousValue = "";
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
