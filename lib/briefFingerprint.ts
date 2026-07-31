import type { BriefState } from "@/types/workspace";

export function createBriefFingerprint(brief: BriefState) {
  return JSON.stringify({
    businessContext: brief.businessContext.value,
    primaryChallenge: brief.primaryChallenge.value,
    currentWorkflow: brief.currentWorkflow.value,
    requirements: brief.requirements.value,
    recommendedDirection: brief.recommendedDirection.value,
    openQuestions: brief.openQuestions.value,
    nextStep: brief.nextStep.value,
  });
}
