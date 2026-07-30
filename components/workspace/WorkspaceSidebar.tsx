import {
  Building2,
  FileText,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { BrandLogo } from "@/components/landing/BrandLogo";
import type { UserState } from "@/types/workspace";
import { roleLabels } from "./workspaceContent";
import styles from "./DiscoveryWorkspace.module.css";

export function WorkspaceSidebar({ user }: { user: UserState }) {
  return (
    <aside className={styles.sidebar}>
      <BrandLogo />

      <nav aria-label="Workspace navigation">
        <a href="#conversation-panel" aria-current="page">
          <MessageSquareText size={17} strokeWidth={1.7} aria-hidden="true" />
          Discovery
        </a>
        <a href="#brief-panel">
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
    </aside>
  );
}
