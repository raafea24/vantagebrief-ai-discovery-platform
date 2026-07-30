"use client";

import { OnboardingPanel } from "./OnboardingPanel";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspacePreview } from "./WorkspacePreview";
import { WorkspaceReadyState } from "./WorkspaceReadyState";
import { useAppSelector } from "@/store/hooks";
import { selectHydrationStatus } from "@/store/features/session/sessionSelectors";
import { selectUser } from "@/store/features/user/userSelectors";
import styles from "./WorkspaceOnboarding.module.css";

export function WorkspaceApp() {
  const hydrationStatus = useAppSelector(selectHydrationStatus);
  const user = useAppSelector(selectUser);

  if (hydrationStatus !== "ready") {
    return (
      <div className={styles.shell}>
        <WorkspaceHeader />
        <main className={styles.loadingState}>
          <span className={styles.loadingMark} aria-hidden="true">
            V
          </span>
          <p role="status">Preparing your workspace…</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <WorkspaceHeader />
      <div className={styles.steps} aria-label="Onboarding progress">
        <span className={!user.onboardingCompleted ? styles.activeStep : ""}>
          <b>1</b>
          Business context
        </span>
        <i aria-hidden="true" />
        <span className={user.onboardingCompleted ? styles.activeStep : ""}>
          <b>2</b>
          Workspace ready
        </span>
      </div>

      {user.onboardingCompleted ? (
        <WorkspaceReadyState user={user} />
      ) : (
        <main className={styles.onboardingMain}>
          <OnboardingPanel />
          <WorkspacePreview />
        </main>
      )}
    </div>
  );
}
