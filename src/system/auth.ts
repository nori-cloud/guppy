import { db } from "@/db"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth, { type NextAuthOptions } from "next-auth"
import { baseConfig } from "./auth.config"

/**
 * check https://authjs.dev/guides/edge-compatibility#middleware
 * as to why we are splitting the auth config into a separate file
 * 
 * all for edge compatibility
 */
export const adaptorConfig: NextAuthOptions = {
  ...baseConfig,
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(adaptorConfig)