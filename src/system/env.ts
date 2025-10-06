export const BetterAuth = {
  Secret: process.env.BETTER_AUTH_SECRET,
  BaseUrl: process.env.BETTER_AUTH_URL,
  OIDC:
    !!process.env.AUTH_OIDC_ID &&
      !!process.env.AUTH_OIDC_CLIENT_ID &&
      !!process.env.AUTH_OIDC_CLIENT_SECRET &&
      !!process.env.AUTH_OIDC_DISCOVERY_URL
      ? {
        ID: process.env.AUTH_OIDC_ID,
        ClientID: process.env.AUTH_OIDC_CLIENT_ID,
        ClientSecret: process.env.AUTH_OIDC_CLIENT_SECRET,
        DiscoveryUrl: process.env.AUTH_OIDC_DISCOVERY_URL,
      }
      : null,
}

export const Drizzle = {
  DatabaseUrl: process.env.DATABASE_URL,
}


export const Steam = process.env.STEAM_API_KEY ? {
  APIKey: process.env.STEAM_API_KEY,
} : null
