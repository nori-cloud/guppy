import { z } from "zod"
const providersSchema = z.object({
  ID: z.string(),
  Secret: z.string(),
})

const envSchema = z.object({
  NextAuth: z.object({
    Secret: z.string(),
    Discord: providersSchema,
    Github: providersSchema,
  }),
  Drizzle: z.object({
    DatabaseUrl: z.string(),
  }),
})

export const env = envSchema.parse({
  NextAuth: {
    Secret: process.env.NEXTAUTH_SECRET as string,
    Discord: {
      ID: process.env.AUTH_DISCORD_ID as string,
      Secret: process.env.AUTH_DISCORD_SECRET as string,
    },
    Github: {
      ID: process.env.AUTH_GITHUB_ID as string,
      Secret: process.env.AUTH_GITHUB_SECRET as string,
    },
  },
  Drizzle: {
    DatabaseUrl: process.env.DATABASE_URL as string,
  },
})
