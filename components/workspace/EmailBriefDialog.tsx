"use client";

import { Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from "./DiscoveryWorkspace.module.css";

export function EmailBriefDialog({
  open,
  maskedEmail,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  maskedEmail: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll<HTMLButtonElement>(
        "button:not(:disabled)",
      ) ?? [],
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }

  return (
    <div
      className={styles.dialogBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={styles.emailDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-dialog-title"
        aria-describedby="email-dialog-description"
        onKeyDown={handleKeyDown}
      >
        <span className={styles.emailDialogIcon} aria-hidden="true">
          <Mail size={21} strokeWidth={1.6} />
        </span>
        <p className={styles.emailDialogEyebrow}>Confirm delivery</p>
        <h2 id="email-dialog-title">Email this Opportunity Brief?</h2>
        <p id="email-dialog-description">
          VantageBrief will ask the secure workflow to send the current brief
          to <strong>{maskedEmail}</strong>.
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
            Confirm email brief
          </button>
        </div>
      </div>
    </div>
  );
}
