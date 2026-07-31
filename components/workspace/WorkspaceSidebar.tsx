import {
  Building2,
  FileText,
  MessageSquareText,
  UserRound,
  ArrowLeft,
} from "lucide-react";
import { BrandLogo } from "@/components/landing/BrandLogo";
import Link from "next/link";
import type { UserState } from "@/types/workspace";
import { roleLabels } from "./workspaceContent";
import type { MobilePanel } from "./workspaceTypes";
import styles from "./DiscoveryWorkspace.module.css";

export function WorkspaceSidebar({
  activePanel,
  user,
}: {
  activePanel: MobilePanel;
  user: UserState;
}) {
  return (
    <aside className={styles.sidebar}>
      <BrandLogo href="/" />

      <nav aria-label="Workspace navigation">
        <a
          href="/workspace#discovery-panel"
          aria-current={activePanel === "conversation" ? "page" : undefined}
        >
          <MessageSquareText size={17} strokeWidth={1.7} aria-hidden="true" />
          Discovery
        </a>
        <a
          href="/workspace#brief-panel"
          aria-current={activePanel === "brief" ? "page" : undefined}
        >
          <FileText size={17} strokeWidth={1.7} aria-hidden="true" />
          Opportunity Brief
        </a>
      </nav>

      <details className={styles.contextCard} open>
        <summary>Business context</summary>
        <div>
          <p>
            <Building2 size={15} strokeWidth={1.7} aria-hidden="true" />
            <strong>{user.companyName}</strong>
          </p>
          <p>
            <UserRound size={15} strokeWidth={1.7} aria-hidden="true" />
            <span>
              {user.fullName}
              <small>{roleLabels[user.role]}</small>
            </span>
          </p>
          <blockquote>{user.challenge}</blockquote>
        </div>
      </details>
      <Link className={styles.backToWebsite} href="/">
        <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
        Back to website
      </Link>
    </aside>
  );
}
