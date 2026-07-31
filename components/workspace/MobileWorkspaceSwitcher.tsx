import type { MobilePanel } from "./workspaceTypes";
import styles from "./DiscoveryWorkspace.module.css";

export function MobileWorkspaceSwitcher({
  activePanel,
}: {
  activePanel: MobilePanel;
}) {
  return (
    <div
      className={styles.mobileTabs}
      role="tablist"
      aria-label="Workspace panels"
    >
      <a
        id="conversation-tab"
        href="/workspace#discovery-panel"
        role="tab"
        aria-selected={activePanel === "conversation"}
        aria-controls="discovery-panel"
      >
        Conversation
      </a>
      <a
        id="brief-tab"
        href="/workspace#brief-panel"
        role="tab"
        aria-selected={activePanel === "brief"}
        aria-controls="brief-panel"
      >
        Brief
      </a>
    </div>
  );
}
