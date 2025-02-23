import { z } from "zod";
const providersSchema = z.object({
  ID: z.string(),
  Secret: z.string(),
});

const envSchema = z.object({
  NextAuth: z.object({
    Secret: z.string(),
    Discord: providersSchema,
  }),
});

export const env = {
  NextAuth: {
    Secret: process.env.NEXTAUTH_SECRET,
    Discord: {
      ID: process.env.AUTH_DISCORD_ID,
      Secret: process.env.AUTH_DISCORD_SECRET,
    },
  },
};
