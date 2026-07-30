import type { ConversationMessage } from "@/types/workspace";
import styles from "./DiscoveryWorkspace.module.css";

function formatMessageTime(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function MessageBubble({
  message,
}: {
  message: ConversationMessage;
}) {
  const isUser = message.sender === "user";

  return (
    <article
      className={`${styles.message} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
      aria-label={`${isUser ? "You" : "VantageBrief"} at ${formatMessageTime(
        message.createdAt,
      )}`}
    >
      {!isUser ? (
        <span className={styles.assistantAvatar} aria-hidden="true">
          V
        </span>
      ) : null}
      <div>
        <div className={styles.messageMeta}>
          <strong>{isUser ? "You" : "VantageBrief"}</strong>
          <time dateTime={message.createdAt}>
            {formatMessageTime(message.createdAt)}
          </time>
        </div>
        <p>{message.content}</p>
        {message.status !== "sent" ? (
          <small>
            {message.status === "pending" ? "Sending…" : "Not sent"}
          </small>
        ) : null}
      </div>
    </article>
  );
}
