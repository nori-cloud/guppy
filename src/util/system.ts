import { z } from "zod";

const envSchema = z.object({
  NextAuth: z.object({
    url: z.string().default("http://localhost:3000"),
  }),
});

export const env = envSchema.parse({
  NextAuth: {
    url: process.env.NEXT_AUTH_URL,
  },
});
