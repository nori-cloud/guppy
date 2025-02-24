import { type NextAuthConfig } from "next-auth"
import Discord from "next-auth/providers/discord"
import Github from "next-auth/providers/github"
import { env } from "./env"

export const baseConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    Github({
      clientId: env.NextAuth.Github.ID,
      clientSecret: env.NextAuth.Github.Secret,
    }),
    Discord({
      clientId: env.NextAuth.Discord.ID,
      clientSecret: env.NextAuth.Discord.Secret,
    })
  ]
}
