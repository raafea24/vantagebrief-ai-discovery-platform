import { BrandLogo } from "@/components/landing/BrandLogo";
import styles from "./WorkspaceOnboarding.module.css";

export function WorkspaceHeader() {
  return (
    <header className={styles.header}>
      <BrandLogo />
      <p className={styles.privacyNote}>
        Your information is used only to personalize this discovery session.
      </p>
    </header>
  );
}
