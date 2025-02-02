import { z } from 'zod';

export const InternalServerModes = ['SURVIVAL', 'ATTACK', 'PVP', 'SANDBOX'] as const;

export type InternalServerMode = (typeof InternalServerModes)[number];

export const PutInternalServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
  hostCommand: z.string().max(1000).optional(),
});

export type PutInternalServerRequest = z.infer<typeof PutInternalServerSchema>;

export const PutInternalServerPortSchema = z.object({
  port: z.coerce
    .number()
    .int()
    .refine((value) => value === 0 || (value >= 6567 && value <= 6577)),
  official: z.boolean(),
});

export type PutInternalServerPortRequest = z.infer<typeof PutInternalServerPortSchema>;
