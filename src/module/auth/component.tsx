"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { DashboardPage, HomePage } from "@/system/route"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Button
      type="submit"
      onClick={async () => {
        setIsLoading(true)
        await authClient.signIn.oauth2({
          providerId: "nori-cloud",
          callbackURL: DashboardPage.Url(),
        })
        setIsLoading(false)
      }}
    >
      {isLoading ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export function SignOut() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  return (
    <button
      type="submit"
      className="w-full cursor-pointer"
      onClick={() => {
        setIsLoading(true)
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push(HomePage.Url())
            },
          },
        })
        setIsLoading(false)
      }}
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  )
}
