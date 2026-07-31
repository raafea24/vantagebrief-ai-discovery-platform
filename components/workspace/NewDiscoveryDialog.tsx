"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from "./DiscoveryWorkspace.module.css";

export function NewDiscoveryDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key !== "Tab") return;
    const buttons = Array.from(
      dialogRef.current?.querySelectorAll<HTMLButtonElement>(
        "button:not(:disabled)",
      ) ?? [],
    );
    const first = buttons[0];
    const last = buttons.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <div className={styles.dialogBackdrop}>
      <div
        ref={dialogRef}
        className={styles.emailDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-discovery-title"
        aria-describedby="new-discovery-description"
        onKeyDown={handleKeyDown}
      >
        <span className={styles.emailDialogIcon} aria-hidden="true">
          <RotateCcw size={21} strokeWidth={1.7} />
        </span>
        <p className={styles.emailDialogEyebrow}>Reset browser session</p>
        <h2 id="new-discovery-title">Start a new discovery?</h2>
        <p id="new-discovery-description">
          This will clear the current conversation, Opportunity Brief and
          email status from this browser session.
        </p>
        <div className={styles.emailDialogActions}>
          <button
            ref={cancelButtonRef}
            type="button"
            className={styles.emailDialogCancel}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.emailDialogConfirm}
            onClick={onConfirm}
          >
            Start New Discovery
          </button>
        </div>
      </div>
    </div>
  );
}
