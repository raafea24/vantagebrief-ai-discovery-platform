import { Check } from "lucide-react";
import type { DiscoveryProgressState } from "@/store/features/brief/briefSelectors";
import styles from "./DiscoveryWorkspace.module.css";

const stages = [
  { key: "context", name: "Context", description: "Business context set" },
  { key: "challenge", name: "Challenge", description: "Clarify the core challenge" },
  { key: "workflow", name: "Workflow", description: "Map the current workflow" },
  { key: "requirements", name: "Requirements", description: "Identify key requirements" },
  { key: "direction", name: "Direction", description: "Define a practical direction" },
  { key: "brief", name: "Brief", description: "Complete the opportunity brief" },
] as const;

export function DiscoveryProgress({
  progress,
}: {
  progress: DiscoveryProgressState;
}) {
  return (
    <section className={styles.progress} aria-labelledby="progress-title">
      <h2 id="progress-title">Discovery progress</h2>
      <ol>
        {stages.map((stage, index) => {
          const state = progress.stages[stage.key];

          return (
            <li key={stage.key} data-state={state}>
              <span aria-hidden="true">
                {state === "complete" ? (
                  <Check size={14} strokeWidth={2} />
                ) : (
                  index + 1
                )}
              </span>
              <div>
                <strong>{stage.name}</strong>
                <small>{stage.description}</small>
                <span className={styles.srOnly}>{state}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
