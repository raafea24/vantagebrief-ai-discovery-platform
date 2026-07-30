import type { Metadata } from "next";
import { WorkspaceApp } from "@/components/workspace/WorkspaceApp";

export const metadata: Metadata = {
  title: "Workspace | VantageBrief",
  description:
    "Share your business context and prepare a focused VantageBrief discovery session.",
};

export default function WorkspacePage() {
  return <WorkspaceApp />;
}
