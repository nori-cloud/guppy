import { getCurrentUser } from "@/db/user"
import { SignInPage } from "@/system/route"
import { redirect } from "next/navigation"
import React from "react"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect(SignInPage.Url())
  }

  return <div className="container max-h-screen max-w-screen">{children}</div>
}
