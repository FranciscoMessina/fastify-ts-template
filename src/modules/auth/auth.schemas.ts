import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authResponseSchema = authSchema
  .extend({
    email: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
    id: z.string(),
  })
  .omit({ password: true });

export type AuthInput = z.infer<typeof authSchema>;
