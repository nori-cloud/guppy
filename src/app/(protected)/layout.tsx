import { AuthRoute } from "@/module/auth/route"
import { auth } from "@/system/auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) {
    redirect(AuthRoute.SignIn.Url)
  }

  return children
}
