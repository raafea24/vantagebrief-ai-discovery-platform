import { z } from "zod";
import { workspaceRoles } from "@/types/workspace";

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Name must be 100 characters or fewer."),
  companyName: z
    .string()
    .trim()
    .min(1, "Enter your business or company name.")
    .max(120, "Business name must be 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your work email.")
    .max(254, "Email must be 254 characters or fewer.")
    .email("Enter a valid work email.")
    .transform((value) => value.toLowerCase()),
  role: z.enum(workspaceRoles, {
    error: "Select your role.",
  }),
  challenge: z
    .string()
    .trim()
    .min(1, "Describe the challenge or opportunity you want to explore.")
    .max(1500, "Challenge must be 1,500 characters or fewer."),
});

export type OnboardingInput = z.input<typeof onboardingSchema>;
export type OnboardingData = z.output<typeof onboardingSchema>;
