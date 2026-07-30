"use client";

import { ArrowUp } from "lucide-react";
import type { KeyboardEvent } from "react";
import styles from "./DiscoveryWorkspace.module.css";

interface MessageComposerProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageComposer({
  value,
  disabled = false,
  onChange,
  onSubmit,
}: MessageComposerProps) {
  const canSubmit = !disabled && value.trim().length > 0;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (canSubmit) {
      onSubmit();
    }
  }

  return (
    <div className={styles.composer}>
      <label htmlFor="workspace-message">Message</label>
      <textarea
        id="workspace-message"
        name="workspace-message"
        rows={3}
        maxLength={4000}
        value={value}
        disabled={disabled}
        placeholder="Describe the challenge, workflow or decision you want to explore…"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.composerFooter}>
        <span>Enter to submit · Shift + Enter for a new line</span>
        <button
          type="button"
          disabled={!canSubmit}
          aria-label="Submit discovery message"
          onClick={onSubmit}
        >
          <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
