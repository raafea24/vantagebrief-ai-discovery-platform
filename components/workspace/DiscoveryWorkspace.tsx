"use client";

import { PencilLine } from "lucide-react";
import { useState } from "react";
import { maskEmail } from "@/lib/email";
import { createWorkspaceSessionId } from "@/lib/session";
import { selectBrief } from "@/store/features/brief/briefSelectors";
import { selectConversation } from "@/store/features/conversation/conversationSelectors";
import { setMessageDraft } from "@/store/features/conversation/conversationSlice";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";
import { selectSession } from "@/store/features/session/sessionSelectors";
import { selectEmail } from "@/store/features/email/emailSelectors";
import { sendBriefEmail } from "@/store/features/email/emailThunks";
import { editOnboarding } from "@/store/features/user/userSlice";
import { selectWorkspace } from "@/store/features/workspace/workspaceSelectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { LocalUserMessage, UserState } from "@/types/workspace";
import { ConversationEmptyState } from "./ConversationEmptyState";
import { ConversationErrorState } from "./ConversationErrorState";
import { ConversationTimeline } from "./ConversationTimeline";
import { DiscoveryProgress } from "./DiscoveryProgress";
import { EmailBriefDialog } from "./EmailBriefDialog";
import { MessageComposer } from "./MessageComposer";
import { MobileWorkspaceSwitcher } from "./MobileWorkspaceSwitcher";
import { OpportunityBriefPanel } from "./OpportunityBriefPanel";
import { QuickPrompts } from "./QuickPrompts";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import type { MobilePanel } from "./workspaceTypes";
import styles from "./DiscoveryWorkspace.module.css";

interface DiscoveryWorkspaceProps {
  user: UserState;
}

function formatUpdatedTime(timestamp: string | null) {
  if (!timestamp) {
    return "Session ready";
  }

  return `Updated ${new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp))}`;
}

export function DiscoveryWorkspace({ user }: DiscoveryWorkspaceProps) {
  const dispatch = useAppDispatch();
  const conversation = useAppSelector(selectConversation);
  const workspace = useAppSelector(selectWorkspace);
  const brief = useAppSelector(selectBrief);
  const session = useAppSelector(selectSession);
  const email = useAppSelector(selectEmail);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("conversation");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const firstName = user.fullName.split(/\s+/)[0];
  const isActive = conversation.messages.length > 0;
  const isPending = conversation.requestStatus === "pending";
  const isEmailProcessing = email.status === "processing";

  function createMessage(content: string): LocalUserMessage {
    return {
      id: createWorkspaceSessionId(),
      content,
      createdAt: new Date().toISOString(),
    };
  }

  function submitMessage() {
    const content = conversation.draft.trim();

    if (!content || isPending) {
      return;
    }

    void dispatch(sendConversationMessage({ message: createMessage(content) }));
  }

  function retryFailedMessage() {
    const failedMessageId = conversation.failedRequest?.messageId;
    const failedMessage = conversation.messages.find(
      (message) => message.id === failedMessageId && message.sender === "user",
    );

    if (!failedMessage || isPending) {
      return;
    }

    void dispatch(
      sendConversationMessage({
        message: {
          id: failedMessage.id,
          content: failedMessage.content,
          createdAt: failedMessage.createdAt,
        },
        retry: true,
      }),
    );
  }

  function requestBriefEmail() {
    setEmailDialogOpen(false);
    void dispatch(sendBriefEmail());
  }

  return (
    <div className={styles.workspace}>
      <WorkspaceSidebar user={user} />

      <div className={styles.workspaceMain}>
        <header className={styles.workspaceHeader}>
          <div>
            <p>
              Good to see you, <em>{firstName}</em>
            </p>
            <span>Let&apos;s turn your context into a practical opportunity.</span>
          </div>
          <div className={styles.headerActions}>
            <div>
              <span className={styles.discoveryStatus}>
                <i aria-hidden="true" />
                {isActive ? "Discovery in progress" : "Discovery ready"}
              </span>
              <small>{formatUpdatedTime(session.updatedAt)}</small>
            </div>
            <button type="button" onClick={() => dispatch(editOnboarding())}>
              <PencilLine size={16} strokeWidth={1.8} aria-hidden="true" />
              Edit business details
            </button>
          </div>
        </header>

        <DiscoveryProgress
          currentStage={workspace.discoveryStage}
          briefComplete={brief.status === "complete"}
        />

        <MobileWorkspaceSwitcher
          activePanel={mobilePanel}
          onChange={setMobilePanel}
        />

        <div className={styles.workspaceContent}>
          <section
            id="conversation-panel"
            className={`${styles.conversationPanel} ${
              mobilePanel !== "conversation" ? styles.mobileHidden : ""
            } ${isActive ? styles.conversationPanelActive : ""}`}
            aria-labelledby="conversation-title"
          >
            {isActive ? (
              <>
                <h1 id="conversation-title" className={styles.timelineTitle}>
                  Discovery conversation
                </h1>
                <ConversationTimeline
                  messages={conversation.messages}
                  isTyping={isPending}
                />
                {conversation.failedRequest ? (
                  <ConversationErrorState
                    message={conversation.failedRequest.message}
                    onRetry={retryFailedMessage}
                  />
                ) : null}
                <QuickPrompts
                  compact
                  onSelect={(prompt) => dispatch(setMessageDraft(prompt))}
                />
              </>
            ) : (
              <ConversationEmptyState
                onPromptSelect={(prompt) => dispatch(setMessageDraft(prompt))}
              />
            )}

            <MessageComposer
              value={conversation.draft}
              disabled={isPending || isEmailProcessing}
              onChange={(value) => dispatch(setMessageDraft(value))}
              onSubmit={submitMessage}
            />

            <p className={styles.personalizationNote}>
              Your information is used only to personalize this discovery
              session.
            </p>
          </section>

          <OpportunityBriefPanel
            brief={brief}
            user={user}
            isActive={isActive}
            email={email}
            emailDisabled={
              isPending || isEmailProcessing || email.status === "success"
            }
            onEmailBrief={() => setEmailDialogOpen(true)}
            onRetryEmail={() => void dispatch(sendBriefEmail())}
            className={
              mobilePanel !== "brief" ? styles.mobileHidden : undefined
            }
          />
        </div>
      </div>

      <EmailBriefDialog
        open={emailDialogOpen}
        maskedEmail={maskEmail(user.email)}
        onCancel={() => setEmailDialogOpen(false)}
        onConfirm={requestBriefEmail}
      />
    </div>
  );
}
