import { MessageSquareText, Sparkles } from "lucide-react";
import { QuickPrompts } from "./QuickPrompts";
import styles from "./DiscoveryWorkspace.module.css";

export function ConversationEmptyState({
  onPromptSelect,
}: {
  onPromptSelect: (prompt: string) => void;
}) {
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
      <QuickPrompts onSelect={onPromptSelect} />
    </div>
  );
}
