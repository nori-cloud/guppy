import { DashboardPage } from "@/module/dashboard/route"
import { auth } from "@/system/auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!!session) {
    redirect(DashboardPage.Url)
  }

  return (
    <div>
      <div>Guppy</div>
      {children}
    </div>
  )
}
