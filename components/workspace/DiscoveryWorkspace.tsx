"use client";

import { PencilLine, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { createBriefFingerprint } from "@/lib/briefFingerprint";
import { maskEmail } from "@/lib/email";
import { createWorkspaceSessionId } from "@/lib/session";
import { selectBrief, selectDiscoveryProgress } from "@/store/features/brief/briefSelectors";
import { selectConversation } from "@/store/features/conversation/conversationSelectors";
import { addCompletionMessage, setMessageDraft } from "@/store/features/conversation/conversationSlice";
import { sendConversationMessage } from "@/store/features/conversation/conversationThunks";
import { selectSession } from "@/store/features/session/sessionSelectors";
import { selectEmail } from "@/store/features/email/emailSelectors";
import { sendBriefEmail } from "@/store/features/email/emailThunks";
import {
  markBriefUpdatedSinceEmail,
  resetEmailState,
} from "@/store/features/email/emailSlice";
import { resetBrief } from "@/store/features/brief/briefSlice";
import { resetConversation } from "@/store/features/conversation/conversationSlice";
import { resetSession } from "@/store/features/session/sessionSlice";
import { editOnboarding } from "@/store/features/user/userSlice";
import { resetUser } from "@/store/features/user/userSlice";
import {
  resetWorkspace,
  setSelectedPanel,
} from "@/store/features/workspace/workspaceSlice";
import { selectWorkspace } from "@/store/features/workspace/workspaceSelectors";
import { WORKSPACE_STORAGE_KEY } from "@/store/persistence";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { LocalUserMessage, UserState } from "@/types/workspace";
import { ConversationEmptyState } from "./ConversationEmptyState";
import { ConversationErrorState } from "./ConversationErrorState";
import { ConversationTimeline } from "./ConversationTimeline";
import { DiscoveryProgress } from "./DiscoveryProgress";
import { EmailBriefDialog } from "./EmailBriefDialog";
import { MessageComposer } from "./MessageComposer";
import { MobileWorkspaceSwitcher } from "./MobileWorkspaceSwitcher";
import { NewDiscoveryDialog } from "./NewDiscoveryDialog";
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
  const brief = useAppSelector(selectBrief);
  const progress = useAppSelector(selectDiscoveryProgress);
  const workspace = useAppSelector(selectWorkspace);
  const session = useAppSelector(selectSession);
  const email = useAppSelector(selectEmail);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("conversation");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [newDiscoveryDialogOpen, setNewDiscoveryDialogOpen] = useState(false);
  const firstName = user.fullName.split(/\s+/)[0];
  const isActive = conversation.messages.length > 0;
  const isPending = conversation.requestStatus === "pending";
  const isEmailProcessing = email.status === "processing";

  useEffect(() => {
    if (
      email.status === "success" &&
      email.sentBriefFingerprint !== createBriefFingerprint(brief)
    ) {
      dispatch(markBriefUpdatedSinceEmail());
    }
  }, [brief, dispatch, email.sentBriefFingerprint, email.status]);

  useEffect(() => {
    if (!progress.isComplete) return;

    dispatch(addCompletionMessage({
      id: "a54151a8-5557-4e51-8953-71f65530de3c",
      sender: "assistant",
      content: "Discovery is complete. Your Opportunity Brief is ready for review. Review the structured brief and email it when you’re ready.",
      createdAt: session.updatedAt ?? new Date().toISOString(),
      status: "sent",
    }));

    if (window.location.hash !== "#brief-panel") {
      window.location.hash = "brief-panel";
    }
  }, [dispatch, progress.isComplete, session.updatedAt]);

  useEffect(() => {
    let focusFrameId: number | undefined;

    function synchronizePanelWithHash(moveDefaultIntoView = false) {
      const nextPanel: MobilePanel =
        window.location.hash === "#brief-panel"
          ? "brief"
          : window.location.hash === "#discovery-panel"
            ? "conversation"
            : workspace.selectedPanel;
      const hasWorkspaceHash =
        window.location.hash === "#brief-panel" ||
        window.location.hash === "#discovery-panel";

      setMobilePanel(nextPanel);
      dispatch(setSelectedPanel(nextPanel));

      if (!hasWorkspaceHash && !moveDefaultIntoView) {
        return;
      }

      focusFrameId = window.requestAnimationFrame(() => {
        const targetId =
          nextPanel === "brief" ? "brief-panel" : "discovery-panel";
        const target = document.getElementById(targetId);
        const reducedMotion =
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
          false;

        target?.scrollIntoView?.({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
        target?.focus({ preventScroll: true });
      });
    }

    function handleHashChange() {
      synchronizePanelWithHash(true);
    }

    const hydrationFrameId = window.requestAnimationFrame(() => {
      synchronizePanelWithHash();
    });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (focusFrameId !== undefined) {
        window.cancelAnimationFrame(focusFrameId);
      }
      window.cancelAnimationFrame(hydrationFrameId);
    };
  }, [dispatch, workspace.selectedPanel]);

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

  function startNewDiscovery() {
    setNewDiscoveryDialogOpen(false);
    window.sessionStorage.removeItem(WORKSPACE_STORAGE_KEY);
    dispatch(resetEmailState());
    dispatch(resetBrief());
    dispatch(resetConversation());
    dispatch(resetWorkspace());
    dispatch(resetSession());
    dispatch(resetUser());
    window.history.replaceState(null, "", "/workspace");
  }

  return (
    <div className={styles.workspace}>
      <WorkspaceSidebar activePanel={mobilePanel} user={user} />

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
                {progress.isComplete
                  ? "Discovery complete"
                  : isActive
                    ? "Discovery in progress"
                    : "Discovery ready"}
              </span>
              <small>{formatUpdatedTime(session.updatedAt)}</small>
            </div>
            <button type="button" onClick={() => dispatch(editOnboarding())}>
              <PencilLine size={16} strokeWidth={1.8} aria-hidden="true" />
              Edit business details
            </button>
            {progress.isComplete ? (
              <button
                type="button"
                onClick={() => setNewDiscoveryDialogOpen(true)}
              >
                <RotateCcw size={16} strokeWidth={1.8} aria-hidden="true" />
                Start New Discovery
              </button>
            ) : null}
          </div>
        </header>

        <DiscoveryProgress progress={progress} />

        <MobileWorkspaceSwitcher
          activePanel={mobilePanel}
        />

        <div className={styles.workspaceContent}>
          <section
            id="discovery-panel"
            tabIndex={-1}
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
      <NewDiscoveryDialog
        open={newDiscoveryDialogOpen}
        onCancel={() => setNewDiscoveryDialogOpen(false)}
        onConfirm={startNewDiscovery}
      />
    </div>
  );
}
