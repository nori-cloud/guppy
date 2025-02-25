import { getCurrentUser } from "@/db/user"
import { AuthRoute } from "@/module/auth/route"
import UserMenu from "@/module/dashboard/user-menu"
import { redirect } from "next/navigation"
import React from "react"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect(AuthRoute.SignIn.Url)
  }

  return (
    <>
      {children}
      <UserMenu user={currentUser} />
    </>
  )
}
