import {
  CircleCheck,
  FileText,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import styles from "./WorkspaceOnboarding.module.css";

export function WorkspacePreview() {
  return (
    <aside className={styles.preview} aria-label="Workspace preview">
      <div className={styles.previewIntroduction}>
        <span>
          <Sparkles size={15} strokeWidth={1.7} aria-hidden="true" />
          Workspace preview
        </span>
        <h2>A clearer starting point.</h2>
        <p>
          Your context becomes the foundation for a focused discovery session
          and a structured Opportunity Brief.
        </p>
      </div>

      <div className={styles.previewWindow} aria-hidden="true">
        <div className={styles.previewTopbar}>
          <span className={styles.previewMark}>V</span>
          <span>VantageBrief</span>
          <span className={styles.previewStatus}>
            <span />
            Ready for discovery
          </span>
        </div>

        <div className={styles.previewBody}>
          <nav className={styles.previewRail}>
            <span className={styles.previewRailItemActive}>
              <MessageSquareText size={15} strokeWidth={1.7} />
              Discovery
            </span>
            <span>
              <FileText size={15} strokeWidth={1.7} />
              Opportunity Brief
            </span>
          </nav>

          <div className={styles.previewConversation}>
            <span className={styles.previewSectionLabel}>Guided discovery</span>
            <div className={styles.previewQuestion}>
              What would make this opportunity valuable for your business?
            </div>
            <div className={styles.previewResponse}>
              We need a clearer way to align the team before committing to a
              solution.
            </div>
            <div className={styles.previewAnalyzing}>
              <span />
              Structuring your context
            </div>
          </div>

          <div className={styles.previewBrief}>
            <span className={styles.previewSectionLabel}>
              Opportunity Brief
            </span>
            <h3>Discovery summary</h3>
            <dl>
              <div>
                <dt>Business context</dt>
                <dd>
                  <CircleCheck size={14} strokeWidth={1.8} />
                  Captured
                </dd>
              </div>
              <div>
                <dt>Primary challenge</dt>
                <dd>In discovery</dd>
              </div>
              <div>
                <dt>Open questions</dt>
                <dd>To clarify</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <p className={styles.previewFootnote}>
        A static preview of the discovery workspace.
      </p>
    </aside>
  );
}
