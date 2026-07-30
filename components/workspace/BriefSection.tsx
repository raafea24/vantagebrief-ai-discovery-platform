import { Check, CircleDot } from "lucide-react";
import type { BriefSectionStatus } from "@/types/workspace";
import styles from "./DiscoveryWorkspace.module.css";

export function BriefSection({
  label,
  status,
  children,
}: {
  label: string;
  status: BriefSectionStatus;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.briefSection} data-status={status}>
      <span aria-hidden="true">
        {status === "complete" ? (
          <Check size={13} strokeWidth={2} />
        ) : status === "current" ? (
          <CircleDot size={13} strokeWidth={1.8} />
        ) : (
          <span />
        )}
      </span>
      <div>
        <strong>{label}</strong>
        {children}
      </div>
    </section>
  );
}
