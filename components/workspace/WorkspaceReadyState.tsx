import { Check, FileText, MessageSquareText } from "lucide-react";
import type { UserState } from "@/types/workspace";
import { roleLabels } from "./workspaceContent";
import styles from "./WorkspaceOnboarding.module.css";

interface WorkspaceReadyStateProps {
  user: UserState;
}

export function WorkspaceReadyState({ user }: WorkspaceReadyStateProps) {
  const firstName = user.fullName.split(/\s+/)[0];

  return (
    <main className={styles.readyMain}>
      <section className={styles.readyPanel} aria-labelledby="ready-title">
        <div className={styles.readyIcon} aria-hidden="true">
          <Check size={24} strokeWidth={1.8} />
        </div>
        <p className={styles.eyebrow}>Workspace ready</p>
        <h1 id="ready-title">Your context is ready, {firstName}.</h1>
        <p className={styles.readySummary}>
          Your onboarding details are saved for this discovery session. The
          guided conversation will begin here in the next approved phase.
        </p>

        <dl className={styles.readyDetails}>
          <div>
            <dt>Business</dt>
            <dd>{user.companyName}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{roleLabels[user.role]}</dd>
          </div>
        </dl>

        <div className={styles.readyNext}>
          <div>
            <MessageSquareText size={20} strokeWidth={1.6} aria-hidden="true" />
            <span>
              <strong>Guided discovery</strong>
              Focused questions based on your business context
            </span>
          </div>
          <div>
            <FileText size={20} strokeWidth={1.6} aria-hidden="true" />
            <span>
              <strong>Opportunity Brief</strong>
              A structured view that will take shape as you continue
            </span>
          </div>
        </div>

        <p className={styles.readyPrivacy}>
          Your information is used only to personalize this discovery session.
        </p>
      </section>
    </main>
  );
}
