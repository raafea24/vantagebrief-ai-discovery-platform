"use client";

import {
  ArrowRight,
  Building2,
  Check,
  CircleDot,
  FileText,
  Flag,
  ListChecks,
  MessageSquareText,
  PencilLine,
  Route,
  Send,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { useRef, useState } from "react";
import { BrandLogo } from "@/components/landing/BrandLogo";
import { createWorkspaceSessionId } from "@/lib/session";
import {
  selectConversation,
} from "@/store/features/conversation/conversationSelectors";
import {
  setMessageDraft,
  submitFirstMessage,
} from "@/store/features/conversation/conversationSlice";
import { editOnboarding } from "@/store/features/user/userSlice";
import { selectWorkspace } from "@/store/features/workspace/workspaceSelectors";
import { setWorkspaceMode } from "@/store/features/workspace/workspaceSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { UserState } from "@/types/workspace";
import { MessageComposer } from "./MessageComposer";
import { roleLabels } from "./workspaceContent";
import styles from "./DiscoveryWorkspace.module.css";

const quickPrompts = [
  {
    icon: Route,
    text: "Where is our current process slowing down?",
  },
  {
    icon: Target,
    text: "Help me define the real business challenge.",
  },
  {
    icon: ListChecks,
    text: "What information do we still need?",
  },
  {
    icon: Flag,
    text: "What should our next step be?",
  },
];

const progressStages = [
  { name: "Context", description: "Business details captured", state: "complete" },
  { name: "Challenge", description: "Ready to explore", state: "current" },
  { name: "Workflow", description: "Current process", state: "pending" },
  { name: "Requirements", description: "Needs and constraints", state: "pending" },
  { name: "Direction", description: "Practical path forward", state: "pending" },
  { name: "Brief", description: "Decision-ready summary", state: "pending" },
] as const;

const briefSections = [
  { label: "Business Context", key: "businessContext" },
  { label: "Primary Challenge", key: "primaryChallenge" },
  { label: "Current Workflow", key: "currentWorkflow" },
  { label: "Requirements", key: "requirements" },
  { label: "Recommended Direction", key: "recommendedDirection" },
  { label: "Open Questions", key: "openQuestions" },
  { label: "Next Step", key: "nextStep" },
] as const;

interface DiscoveryWorkspaceProps {
  user: UserState;
}

type MobilePanel = "conversation" | "brief";

export function DiscoveryWorkspace({ user }: DiscoveryWorkspaceProps) {
  const dispatch = useAppDispatch();
  const conversation = useAppSelector(selectConversation);
  const workspace = useAppSelector(selectWorkspace);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("conversation");
  const submissionLock = useRef(false);
  const firstName = user.fullName.split(/\s+/)[0];

  function submitMessage() {
    const message = conversation.draft.trim();

    if (!message || conversation.firstMessage || submissionLock.current) {
      return;
    }

    submissionLock.current = true;
    dispatch(
      submitFirstMessage({
        id: createWorkspaceSessionId(),
        content: message,
        createdAt: new Date().toISOString(),
      }),
    );
    dispatch(setWorkspaceMode("initiated"));
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
            <span className={styles.discoveryStatus}>
              <i aria-hidden="true" />
              {workspace.mode === "initiated"
                ? "Conversation initiated"
                : "Discovery ready"}
            </span>
            <button type="button" onClick={() => dispatch(editOnboarding())}>
              <PencilLine size={16} strokeWidth={1.8} aria-hidden="true" />
              Edit business details
            </button>
          </div>
        </header>

        <DiscoveryProgress />

        <div
          className={styles.mobileTabs}
          role="tablist"
          aria-label="Workspace panels"
        >
          <button
            id="conversation-tab"
            type="button"
            role="tab"
            aria-selected={mobilePanel === "conversation"}
            aria-controls="conversation-panel"
            onClick={() => setMobilePanel("conversation")}
          >
            Conversation
          </button>
          <button
            id="brief-tab"
            type="button"
            role="tab"
            aria-selected={mobilePanel === "brief"}
            aria-controls="brief-panel"
            onClick={() => setMobilePanel("brief")}
          >
            Brief
          </button>
        </div>

        <div className={styles.workspaceContent}>
          <section
            id="conversation-panel"
            className={`${styles.conversationPanel} ${
              mobilePanel !== "conversation" ? styles.mobileHidden : ""
            }`}
            aria-labelledby="conversation-title"
          >
            {conversation.firstMessage ? (
              <ConversationInitiated message={conversation.firstMessage.content} />
            ) : (
              <ConversationEmpty
                onPromptSelect={(prompt) => dispatch(setMessageDraft(prompt))}
              />
            )}

            {!conversation.firstMessage ? (
              <MessageComposer
                value={conversation.draft}
                onChange={(value) => dispatch(setMessageDraft(value))}
                onSubmit={submitMessage}
              />
            ) : null}

            <p className={styles.personalizationNote}>
              Your information is used only to personalize this discovery
              session.
            </p>
          </section>

          <OpportunityBriefPanel
            user={user}
            className={
              mobilePanel !== "brief" ? styles.mobileHidden : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

function WorkspaceSidebar({ user }: DiscoveryWorkspaceProps) {
  return (
    <aside className={styles.sidebar}>
      <BrandLogo />

      <nav aria-label="Workspace navigation">
        <a href="#conversation-panel" aria-current="page">
          <MessageSquareText size={17} strokeWidth={1.7} aria-hidden="true" />
          Discovery
        </a>
        <a href="#brief-panel">
          <FileText size={17} strokeWidth={1.7} aria-hidden="true" />
          Opportunity Brief
        </a>
      </nav>

      <details className={styles.contextCard} open>
        <summary>Business context</summary>
        <div>
          <p>
            <Building2 size={15} strokeWidth={1.7} aria-hidden="true" />
            <strong>{user.companyName}</strong>
          </p>
          <p>
            <UserRound size={15} strokeWidth={1.7} aria-hidden="true" />
            <span>
              {user.fullName}
              <small>{roleLabels[user.role]}</small>
            </span>
          </p>
          <blockquote>{user.challenge}</blockquote>
        </div>
      </details>
    </aside>
  );
}

function DiscoveryProgress() {
  return (
    <section className={styles.progress} aria-labelledby="progress-title">
      <h2 id="progress-title">Discovery progress</h2>
      <ol>
        {progressStages.map((stage, index) => (
          <li key={stage.name} data-state={stage.state}>
            <span aria-hidden="true">
              {stage.state === "complete" ? (
                <Check size={14} strokeWidth={2} />
              ) : (
                index + 1
              )}
            </span>
            <div>
              <strong>{stage.name}</strong>
              <small>{stage.description}</small>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

interface ConversationEmptyProps {
  onPromptSelect: (prompt: string) => void;
}

function ConversationEmpty({ onPromptSelect }: ConversationEmptyProps) {
  return (
    <div className={styles.emptyConversation}>
      <div className={styles.emptyConversationIcon} aria-hidden="true">
        <MessageSquareText size={34} strokeWidth={1.45} />
        <Sparkles size={17} strokeWidth={1.5} />
      </div>
      <h1 id="conversation-title">Start your discovery conversation</h1>
      <p>
        Share the challenge, workflow or decision you want to explore.
        VantageBrief will ask focused questions and organize what matters as
        the conversation develops.
      </p>
      <div className={styles.quickPrompts} aria-label="Quick prompts">
        {quickPrompts.map(({ icon: Icon, text }) => (
          <button key={text} type="button" onClick={() => onPromptSelect(text)}>
            <Icon size={18} strokeWidth={1.65} aria-hidden="true" />
            <span>{text}</span>
            <ArrowRight size={14} strokeWidth={1.7} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ConversationInitiated({ message }: { message: string }) {
  return (
    <div className={styles.initiatedState}>
      <div className={styles.initiatedIcon} aria-hidden="true">
        <Send size={24} strokeWidth={1.6} />
      </div>
      <p className={styles.initiatedEyebrow}>Conversation initiated</p>
      <h1 id="conversation-title">Your first context is in place.</h1>
      <p>
        This message is saved locally with your discovery session. Guided
        responses will be introduced in the next approved workspace phase.
      </p>
      <div className={styles.firstMessage}>
        <span>You</span>
        <p>{message}</p>
      </div>
    </div>
  );
}

interface OpportunityBriefPanelProps {
  user: UserState;
  className?: string;
}

function OpportunityBriefPanel({
  user,
  className = "",
}: OpportunityBriefPanelProps) {
  return (
    <aside
      id="brief-panel"
      className={`${styles.briefPanel} ${className}`}
      aria-labelledby="brief-title"
    >
      <header>
        <div>
          <p>Structured output</p>
          <h2 id="brief-title">Opportunity Brief</h2>
        </div>
        <span>Not started</span>
      </header>

      <div className={styles.briefIntroduction}>
        <div aria-hidden="true">
          <FileText size={25} strokeWidth={1.5} />
        </div>
        <h3>Your brief will develop here</h3>
        <p>
          As discovery continues, VantageBrief will organize confirmed context
          and open questions into a practical brief.
        </p>
      </div>

      <div className={styles.briefSections}>
        {briefSections.map((section, index) => (
          <div key={section.key} className={styles.briefSection}>
            <span aria-hidden="true">
              {index === 0 ? (
                <Check size={13} strokeWidth={2} />
              ) : index === 1 ? (
                <CircleDot size={13} strokeWidth={1.8} />
              ) : (
                <span />
              )}
            </span>
            <div>
              <strong>{section.label}</strong>
              {index === 0 ? (
                <small>{user.companyName}</small>
              ) : index === 1 ? (
                <small>Ready to explore</small>
              ) : (
                <small>Pending</small>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
