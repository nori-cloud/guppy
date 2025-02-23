import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"
import { env } from "./env"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        isSigningUp: { label: "isSigningUp", type: "checkbox" },
      },
      async authorize(credentials) {
        const user = {
          id: "1",
          name: "John Doe",
          email: credentials?.email,
        }



        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)

        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash)

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }

        // return user object with their profile data
        return user
      },
    }),
    DiscordProvider({
      clientId: env.NextAuth.Discord.ID,
      clientSecret: env.NextAuth.Discord.Secret,
    })],
})