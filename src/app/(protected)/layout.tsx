import { getSession } from "@/lib/auth-action"
import { SignInPage } from "@/system/route"
import { redirect } from "next/navigation"
import React from "react"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect(SignInPage.Url())
  }

  return <div className="container max-h-screen max-w-screen">{children}</div>
}
