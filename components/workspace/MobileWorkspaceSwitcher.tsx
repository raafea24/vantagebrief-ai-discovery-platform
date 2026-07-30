import type { MobilePanel } from "./workspaceTypes";
import styles from "./DiscoveryWorkspace.module.css";

export function MobileWorkspaceSwitcher({
  activePanel,
  onChange,
}: {
  activePanel: MobilePanel;
  onChange: (panel: MobilePanel) => void;
}) {
  return (
    <div
      className={styles.mobileTabs}
      role="tablist"
      aria-label="Workspace panels"
    >
      <button
        id="conversation-tab"
        type="button"
        role="tab"
        aria-selected={activePanel === "conversation"}
        aria-controls="conversation-panel"
        onClick={() => onChange("conversation")}
      >
        Conversation
      </button>
      <button
        id="brief-tab"
        type="button"
        role="tab"
        aria-selected={activePanel === "brief"}
        aria-controls="brief-panel"
        onClick={() => onChange("brief")}
      >
        Brief
      </button>
    </div>
  );
}
