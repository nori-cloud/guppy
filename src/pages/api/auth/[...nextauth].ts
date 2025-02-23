import { db } from "@/db";
import { env } from "@/system/env";
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth, { NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";
import Github from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: DrizzleAdapter(db),
  providers: [
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     console.log(credentials);
    //     return {
    //       id: randomUUID(),
    //       name: "John Doe",
    //       email: credentials?.email,
    //     };
    //   },
    // }),
    Github({
      clientId: env.NextAuth.Github.ID,
      clientSecret: env.NextAuth.Github.Secret,
    }),
    Discord({
      clientId: env.NextAuth.Discord.ID,
      clientSecret: env.NextAuth.Discord.Secret,
    })
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
};

export default NextAuth(authOptions);
