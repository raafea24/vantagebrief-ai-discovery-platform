import { describe, expect, it } from "vitest";
import { onboardingSchema } from "./onboardingSchema";

const validInput = {
  fullName: "  Alex Morgan  ",
  companyName: "  Acme Solutions  ",
  email: "  ALEX@ACMESOLUTIONS.COM  ",
  role: "operations",
  challenge: "  We need to improve coordination across our current workflow.  ",
} as const;

describe("onboardingSchema", () => {
  it("trims text and normalizes the email address", () => {
    const result = onboardingSchema.parse(validInput);

    expect(result).toEqual({
      fullName: "Alex Morgan",
      companyName: "Acme Solutions",
      email: "alex@acmesolutions.com",
      role: "operations",
      challenge: "We need to improve coordination across our current workflow.",
    });
  });

  it("rejects invalid and oversized required values", () => {
    const result = onboardingSchema.safeParse({
      ...validInput,
      fullName: " ".repeat(2),
      email: "not-an-email",
      challenge: "a".repeat(1501),
    });

    expect(result.success).toBe(false);
    expect(
      result.success
        ? []
        : result.error.issues.map((issue) => String(issue.path[0])),
    ).toEqual(expect.arrayContaining(["fullName", "email", "challenge"]));
  });
});
