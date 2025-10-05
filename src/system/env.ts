export const NextAuth = {
  Secret: process.env.NEXTAUTH_SECRET,
  OIDC:
    !!process.env.AUTH_OIDC_ID &&
      !!process.env.AUTH_OIDC_CLIENT_ID &&
      !!process.env.AUTH_OIDC_CLIENT_SECRET &&
      !!process.env.AUTH_OIDC_ISSUER
      ? {
        ID: process.env.AUTH_OIDC_ID,
        ClientID: process.env.AUTH_OIDC_CLIENT_ID,
        ClientSecret: process.env.AUTH_OIDC_CLIENT_SECRET,
        Issuer: process.env.AUTH_OIDC_ISSUER,
      }
      : null,
}

export const Drizzle = {
  DatabaseUrl: process.env.DATABASE_URL,
}


export const Steam = process.env.STEAM_API_KEY ? {
  APIKey: process.env.STEAM_API_KEY,
} : null
