import { BetterAuth } from "@/system/env"
import { createAuthClient } from "better-auth/react"
import { genericOAuthClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
  baseURL: BetterAuth.BaseUrl,
  plugins: [
    genericOAuthClient()
  ]
})
