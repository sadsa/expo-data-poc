import { z } from 'zod';

export const exampleSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
});