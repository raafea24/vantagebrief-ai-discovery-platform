import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/landing/BrandLogo";
import styles from "./WorkspaceOnboarding.module.css";

export function WorkspaceHeader() {
  return (
    <header className={styles.header}>
      <BrandLogo href="/" />
      <Link className={styles.backLink} href="/" aria-label="Back to website">
        <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>
          Back <span className={styles.backLinkContext}>to website</span>
        </span>
      </Link>
    </header>
  );
}
