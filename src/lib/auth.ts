import { BetterAuth } from "@/system/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins"
import { db } from "@/db"
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({
  secret: BetterAuth.Secret,
  baseURL: BetterAuth.BaseUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    genericOAuth({
      config: getProviders()
    }),
    nextCookies()
  ]
});


export function getProviders() {
  const providers = []

  if (!!BetterAuth.OIDC) {
    providers.push({
      name: "Nori-Cloud",
      providerId: BetterAuth.OIDC.ID,
      clientId: BetterAuth.OIDC.ClientID,
      clientSecret: BetterAuth.OIDC.ClientSecret,
      discoveryUrl: BetterAuth.OIDC.DiscoveryUrl,
    })
  }

  if (providers.length === 0) {
    console.error("Application needs to have at least one provider configured.")
  }
  return providers
}
