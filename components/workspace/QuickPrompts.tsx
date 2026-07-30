import {
  ArrowRight,
  Flag,
  ListChecks,
  Route,
  Target,
} from "lucide-react";
import styles from "./DiscoveryWorkspace.module.css";

export const quickPromptOptions = [
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
] as const;

export function QuickPrompts({
  compact = false,
  onSelect,
}: {
  compact?: boolean;
  onSelect: (prompt: string) => void;
}) {
  return (
    <div
      className={
        compact
          ? `${styles.quickPrompts} ${styles.quickPromptsCompact}`
          : styles.quickPrompts
      }
      aria-label="Quick prompts"
    >
      {quickPromptOptions.map(({ icon: Icon, text }) => (
        <button key={text} type="button" onClick={() => onSelect(text)}>
          <Icon size={18} strokeWidth={1.65} aria-hidden="true" />
          <span>{text}</span>
          <ArrowRight size={14} strokeWidth={1.7} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
