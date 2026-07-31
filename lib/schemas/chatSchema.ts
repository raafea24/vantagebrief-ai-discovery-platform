import { z } from "zod";
import { onboardingSchema } from "@/lib/schemas/onboardingSchema";

export const chatActionSchema = z.enum(["chat", "email_brief"]);
export const emailDeliveryStatusSchema = z.enum(["sent", "failed"]);

const sessionIdSchema = z
  .string()
  .trim()
  .min(8)
  .max(100)
  .regex(/^[a-zA-Z0-9_-]+$/);

export const briefPatchSchema = z
  .object({
    businessContext: z.string().trim().min(1).max(4000).optional(),
    primaryChallenge: z.string().trim().min(1).max(4000).optional(),
    currentWorkflow: z
      .array(z.string().trim().min(1).max(1000))
      .max(30)
      .optional(),
    requirements: z
      .array(z.string().trim().min(1).max(1000))
      .max(30)
      .optional(),
    recommendedDirection: z.string().trim().min(1).max(4000).optional(),
    openQuestions: z
      .array(z.string().trim().min(1).max(1000))
      .max(30)
      .optional(),
    nextStep: z.string().trim().min(1).max(4000).optional(),
  })
  .strict();

export const structuredBriefPayloadSchema = z
  .object({
    businessContext: z.string().trim().min(1).max(4000).nullable(),
    primaryChallenge: z.string().trim().min(1).max(4000).nullable(),
    currentWorkflow: z.array(z.string().trim().min(1).max(1000)).max(30),
    requirements: z.array(z.string().trim().min(1).max(1000)).max(30),
    recommendedDirection: z.string().trim().min(1).max(4000).nullable(),
    openQuestions: z.array(z.string().trim().min(1).max(1000)).max(30),
    nextStep: z.string().trim().min(1).max(4000).nullable(),
  })
  .strict();

const chatRequestBase = {
  message: z.string().trim().min(1).max(4000),
  sessionId: sessionIdSchema,
  companyName: onboardingSchema.shape.companyName,
  role: onboardingSchema.shape.role,
  initialChallenge: onboardingSchema.shape.challenge,
};

const conversationChatRequestSchema = z
  .object({
    ...chatRequestBase,
    name: onboardingSchema.shape.fullName,
    email: onboardingSchema.shape.email,
    action: z.literal("chat").optional(),
  })
  .strict();

const emailBriefChatRequestSchema = z
  .object({
    ...chatRequestBase,
    userName: onboardingSchema.shape.fullName,
    userEmail: onboardingSchema.shape.email,
    action: z.literal("email_brief"),
    brief: structuredBriefPayloadSchema,
  })
  .strict();

export const chatRequestSchema = z.union([
  emailBriefChatRequestSchema,
  conversationChatRequestSchema,
]);

export const chatApiResponseSchema = z
  .object({
    httpStatus: z.number().int().min(100).max(599).optional(),
    success: z.boolean(),
    type: z.enum([
      "chat_response",
      "email_confirmation",
      "service_error",
    ]),
    reply: z.string().trim().min(1).max(12_000),
    sessionId: sessionIdSchema,
    action: chatActionSchema.optional(),
    brief: briefPatchSchema.optional(),
    emailStatus: emailDeliveryStatusSchema.optional(),
    emailMessage: z.string().trim().min(1).max(1000).optional(),
  })
  .strict();

const n8nFieldStatusSchema = z
  .enum([
    "not_started",
    "in_progress",
    "identified",
    "complete",
    "current",
    "pending",
  ])
  .optional();

const n8nTextFieldSchema = z
  .object({
    status: n8nFieldStatusSchema,
    value: z.string().trim().min(1).max(4000),
  })
  .passthrough();

const n8nListFieldSchema = z
  .object({
    status: n8nFieldStatusSchema,
    values: z.array(z.string().trim().min(1).max(1000)).max(30),
  })
  .passthrough();

export const n8nStructuredBriefSchema = z
  .object({
    businessContext: n8nTextFieldSchema.optional(),
    primaryObjective: n8nTextFieldSchema.optional(),
    currentChallenge: n8nTextFieldSchema.optional(),
    existingWorkflow: n8nTextFieldSchema.optional(),
    toolsAndIntegrations: n8nListFieldSchema.optional(),
    requirements: n8nListFieldSchema.optional(),
    recommendedDirection: n8nTextFieldSchema.optional(),
    expectedOperationalValue: n8nListFieldSchema.optional(),
    openQuestions: n8nListFieldSchema.optional(),
    recommendedNextStep: n8nTextFieldSchema.optional(),
    updatedAt: z.iso.datetime().optional(),
  })
  .passthrough()
  .refine(
    (brief) =>
      [
        brief.businessContext,
        brief.primaryObjective,
        brief.currentChallenge,
        brief.existingWorkflow,
        brief.toolsAndIntegrations,
        brief.requirements,
        brief.recommendedDirection,
        brief.expectedOperationalValue,
        brief.openQuestions,
        brief.recommendedNextStep,
      ].some(Boolean),
    "Structured brief does not contain a supported section.",
  );

export const n8nChatResponseSchema = z
  .object({
    httpStatus: z
      .number()
      .int()
      .min(100)
      .max(599)
      .optional()
      .catch(undefined),
    success: z.boolean(),
    type: z.enum([
      "chat_response",
      "email_confirmation",
      "validation_error",
      "service_error",
    ]),
    reply: z.string().trim().min(1).max(12_000),
    sessionId: sessionIdSchema,
    brief: z
      .union([briefPatchSchema, n8nStructuredBriefSchema])
      .optional()
      .catch(undefined),
    progress: z.unknown().optional(),
    action: chatActionSchema.nullable().optional().catch(undefined),
    emailStatus: emailDeliveryStatusSchema.optional().catch(undefined),
    emailMessage: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .optional()
      .catch(undefined),
  })
  .passthrough();

export type ValidatedChatRequest = z.output<typeof chatRequestSchema>;
export type ValidatedN8nResponse = z.output<typeof n8nChatResponseSchema>;
