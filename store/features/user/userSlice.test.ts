import { describe, expect, it } from "vitest";
import {
  completeOnboarding,
  initialUserState,
  setUserProfile,
  userReducer,
} from "./userSlice";

const profile = {
  fullName: "Alex Morgan",
  companyName: "Acme Solutions",
  email: "alex@acmesolutions.com",
  role: "operations" as const,
  challenge: "We need to improve coordination across our current workflow.",
};

describe("userSlice", () => {
  it("stores the validated profile and completes onboarding", () => {
    const withProfile = userReducer(
      initialUserState,
      setUserProfile(profile),
    );
    const completed = userReducer(withProfile, completeOnboarding());

    expect(completed).toEqual({
      ...profile,
      onboardingCompleted: true,
    });
  });
});
