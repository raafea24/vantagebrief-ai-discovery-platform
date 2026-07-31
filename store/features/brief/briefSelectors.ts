import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { DiscoveryStage } from "@/types/workspace";

export const selectBrief = (state: RootState) => state.brief;

export type DiscoveryStageState = "complete" | "active" | "upcoming";

export interface DiscoveryProgressState {
  stages: Record<DiscoveryStage, DiscoveryStageState>;
  isComplete: boolean;
}

export const selectDiscoveryProgress = createSelector(selectBrief, (brief): DiscoveryProgressState => {
  const completed = {
    context: brief.businessContext.status === "complete",
    challenge: brief.primaryChallenge.status === "complete",
    workflow: brief.currentWorkflow.status === "complete",
    requirements: brief.requirements.status === "complete",
    direction: brief.recommendedDirection.status === "complete",
    brief: brief.status === "complete",
  };
  const order: DiscoveryStage[] = ["context", "challenge", "workflow", "requirements", "direction", "brief"];
  const firstIncomplete = order.findIndex((stage) => !completed[stage]);
  const stages = Object.fromEntries(order.map((stage, index) => [
    stage,
    completed[stage] ? "complete" : index === firstIncomplete ? "active" : "upcoming",
  ])) as Record<DiscoveryStage, DiscoveryStageState>;

  return { stages, isComplete: brief.status === "complete" };
});
