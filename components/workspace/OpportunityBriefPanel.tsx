import { FileText } from "lucide-react";
import type { BriefField, BriefState, UserState } from "@/types/workspace";
import { BriefSection } from "./BriefSection";
import { roleLabels } from "./workspaceContent";
import styles from "./DiscoveryWorkspace.module.css";

function TextValue({
  field,
  fallback = "Pending",
}: {
  field: BriefField<string | null>;
  fallback?: string;
}) {
  return <p>{field.value ?? fallback}</p>;
}

function ListValue({ field }: { field: BriefField<string[]> }) {
  return field.value.length ? (
    <ul>
      {field.value.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : (
    <p>Pending</p>
  );
}

export function OpportunityBriefPanel({
  brief,
  user,
  isActive,
  className = "",
}: {
  brief: BriefState;
  user: UserState;
  isActive: boolean;
  className?: string;
}) {
  const businessContext =
    brief.businessContext.value ??
    `${user.companyName} · ${roleLabels[user.role]} · ${user.challenge}`;

  return (
    <aside
      id="brief-panel"
      className={`${styles.briefPanel} ${
        isActive ? styles.briefPanelActive : ""
      } ${className}`}
      aria-labelledby="brief-title"
    >
      <header>
        <div>
          <p>Structured output</p>
          <h2 id="brief-title">Opportunity Brief</h2>
        </div>
        <span>{brief.status === "pending" ? "Not started" : brief.status}</span>
      </header>

      {!isActive ? (
        <div className={styles.briefIntroduction}>
          <div aria-hidden="true">
            <FileText size={25} strokeWidth={1.5} />
          </div>
          <h3>Your brief will develop here</h3>
          <p>
            As discovery continues, VantageBrief will organize confirmed
            context and open questions into a practical brief.
          </p>
        </div>
      ) : (
        <p className={styles.briefActiveIntroduction}>
          This brief reflects confirmed context and will continue to evolve as
          discovery progresses.
        </p>
      )}

      <div className={styles.briefSections}>
        <BriefSection label="Business Context" status="complete">
          <p>{businessContext}</p>
        </BriefSection>
        <BriefSection
          label="Primary Challenge"
          status={brief.primaryChallenge.status}
        >
          <TextValue field={brief.primaryChallenge} fallback="Ready to explore" />
        </BriefSection>
        <BriefSection
          label="Current Workflow"
          status={brief.currentWorkflow.status}
        >
          <ListValue field={brief.currentWorkflow} />
        </BriefSection>
        <BriefSection label="Requirements" status={brief.requirements.status}>
          <ListValue field={brief.requirements} />
        </BriefSection>
        <BriefSection
          label="Recommended Direction"
          status={brief.recommendedDirection.status}
        >
          <TextValue field={brief.recommendedDirection} />
        </BriefSection>
        <BriefSection
          label="Open Questions"
          status={brief.openQuestions.status}
        >
          <ListValue field={brief.openQuestions} />
        </BriefSection>
        <BriefSection label="Next Step" status={brief.nextStep.status}>
          <TextValue field={brief.nextStep} />
        </BriefSection>
      </div>
    </aside>
  );
}
