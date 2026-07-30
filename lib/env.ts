import "server-only";
import { z } from "zod";

const serverEnvironmentSchema = z.object({
  N8N_WEBHOOK_URL: z
    .url()
    .refine((value) => ["http:", "https:"].includes(new URL(value).protocol)),
  N8N_WEBHOOK_SECRET: z.string().min(1),
  N8N_WEBHOOK_HEADER_NAME: z
    .string()
    .regex(/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/)
    .default("x-briefflow-key"),
  N8N_REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(120_000)
    .default(60_000),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function getServerEnvironment(): ServerEnvironment {
  return serverEnvironmentSchema.parse({
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
    N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
    N8N_WEBHOOK_HEADER_NAME: process.env.N8N_WEBHOOK_HEADER_NAME,
    N8N_REQUEST_TIMEOUT_MS: process.env.N8N_REQUEST_TIMEOUT_MS,
  });
}
