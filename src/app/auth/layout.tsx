import { getCurrentUser } from "@/db/user"
import { DashboardPage } from "@/system/route"
import { redirect } from "next/navigation"
import React from "react"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  if (!!currentUser) {
    redirect(DashboardPage.Url())
  }

  return (
    <div>
      <div>Guppy</div>
      {children}
    </div>
  )
}
