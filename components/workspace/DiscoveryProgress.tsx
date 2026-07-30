import { Check } from "lucide-react";
import type { DiscoveryStage } from "@/types/workspace";
import styles from "./DiscoveryWorkspace.module.css";

const stages = [
  { key: "context", name: "Context", description: "Business context set" },
  { key: "challenge", name: "Challenge", description: "Clarify the core challenge" },
  { key: "workflow", name: "Workflow", description: "Map the current workflow" },
  { key: "requirements", name: "Requirements", description: "Identify key requirements" },
  { key: "direction", name: "Direction", description: "Define a practical direction" },
  { key: "brief", name: "Brief", description: "Complete the opportunity brief" },
] as const;

const stageOrder: DiscoveryStage[] = [
  "context",
  "challenge",
  "workflow",
  "requirements",
  "direction",
  "brief",
];

export function DiscoveryProgress({
  currentStage,
  briefComplete,
}: {
  currentStage: DiscoveryStage;
  briefComplete: boolean;
}) {
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <section className={styles.progress} aria-labelledby="progress-title">
      <h2 id="progress-title">Discovery progress</h2>
      <ol>
        {stages.map((stage, index) => {
          const state =
            briefComplete || index < currentIndex
              ? "complete"
              : index === currentIndex
                ? "current"
                : "pending";

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
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
