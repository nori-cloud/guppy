import { type NextAuthConfig } from "next-auth"
import { NextAuth } from "./env"


export const baseConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: getProviders(),
}

function getProviders() {
  const providers: NextAuthConfig['providers'] = []

  if (!!NextAuth.OIDC) {
    providers.push({
      type: "oidc",
      name: "Nori-Cloud",
      id: NextAuth.OIDC.ID,
      clientId: NextAuth.OIDC.ClientID,
      clientSecret: NextAuth.OIDC.ClientSecret,
      issuer: NextAuth.OIDC.Issuer,
    })
  }

  if (providers.length === 0) {
    console.error("Application needs to have at least one provider configured.")
  }

  console.log(`Application configured with ${providers.length} providers.`)
  return providers
}
