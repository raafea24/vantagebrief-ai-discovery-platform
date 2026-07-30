import { AlertCircle, RotateCcw } from "lucide-react";
import styles from "./DiscoveryWorkspace.module.css";

export function ConversationErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className={styles.conversationError} role="alert">
      <AlertCircle size={18} strokeWidth={1.8} aria-hidden="true" />
      <div>
        <strong>We couldn&apos;t continue the discovery.</strong>
        <p>{message}</p>
      </div>
      <button type="button" onClick={onRetry}>
        <RotateCcw size={15} strokeWidth={1.8} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
