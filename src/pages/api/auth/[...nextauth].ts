import { env } from "@/system/env";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const authOptions = {
  // Configure one or more authentication providers
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
    Discord({
      clientId: env.NextAuth.Discord.ID,
      clientSecret: env.NextAuth.Discord.Secret,
    })
  ],
  pages: {
    signIn: "/auth/sign-in",
  }
};

export default NextAuth(authOptions);
