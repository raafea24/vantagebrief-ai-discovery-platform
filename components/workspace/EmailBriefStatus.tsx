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
          <strong>Preparing your email request</strong>
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
          <strong>Your brief has been sent.</strong>
          <p>
            {email.message}
            {email.maskedRecipient
              ? ` Recipient: ${email.maskedRecipient}.`
              : ""}
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
        <strong>The brief could not be emailed.</strong>
        <p>{email.error}</p>
      </div>
      <button type="button" onClick={onRetry}>
        <RotateCcw size={14} strokeWidth={1.8} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
