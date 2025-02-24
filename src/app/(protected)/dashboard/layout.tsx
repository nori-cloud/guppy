import { getCurrentUser } from "@/db/user"
import UserMenu from "@/module/dashboard/user-menu"
import React from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  return (
    <>
      {children}
      <UserMenu user={currentUser} />
    </>
  )
}
