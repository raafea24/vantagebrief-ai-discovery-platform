import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import type { EmailState } from "@/types/workspace";
import styles from "./DiscoveryWorkspace.module.css";

export function EmailBriefStatus({
  email,
  onRetry,
}: {
  email: EmailState;
  onRetry: () => void;
}) {
  if (email.status === "idle") {
    return null;
  }

  if (email.status === "processing") {
    return (
      <div className={styles.emailStatus} role="status">
        <LoaderCircle size={17} strokeWidth={1.7} aria-hidden="true" />
        <div>
          <strong>Sending brief…</strong>
          <p>Waiting for confirmed delivery from the secure workflow.</p>
        </div>
      </div>
    );
  }

  if (email.status === "success") {
    return (
      <div
        className={`${styles.emailStatus} ${styles.emailStatusSuccess}`}
        role="status"
      >
        <CheckCircle2 size={17} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <strong>Opportunity Brief sent</strong>
          <p>
            {email.message}
            {email.confirmedRecipient
              ? ` Recipient: ${email.confirmedRecipient}.`
              : ""}
          </p>
          <p>
            Your discovery is kept only for this browser session. The emailed
            brief remains available in your inbox.
          </p>
        </div>
      </div>
    );
  }

  if (email.status === "updated") {
    return (
      <div className={styles.emailStatus} role="status">
        <AlertCircle size={17} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <strong>Brief updated since last email</strong>
          <p>
            The previously emailed version remains available
            {email.confirmedRecipient
              ? ` at ${email.confirmedRecipient}`
              : ""}
            . Email the updated brief when you are ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.emailStatus} ${styles.emailStatusError}`}
      role="alert"
    >
      <AlertCircle size={17} strokeWidth={1.8} aria-hidden="true" />
      <div>
        <strong>
          {email.sentBriefFingerprint
            ? "The updated brief could not be emailed."
            : "The brief could not be emailed."}
        </strong>
        <p>
          {email.error}
          {email.sentBriefFingerprint
            ? " The previously emailed version remains available in the recipient’s inbox."
            : ""}
        </p>
      </div>
      <button type="button" onClick={onRetry}>
        <RotateCcw size={14} strokeWidth={1.8} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
