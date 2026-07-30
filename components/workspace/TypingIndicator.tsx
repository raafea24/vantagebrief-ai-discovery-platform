import styles from "./DiscoveryWorkspace.module.css";

export function TypingIndicator() {
  return (
    <div className={styles.typingIndicator} role="status">
      <span className={styles.assistantAvatar} aria-hidden="true">
        V
      </span>
      <div>
        <strong>VantageBrief is considering your context</strong>
        <span aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
