import { getCurrentUser } from "@/db/user"
import { DashboardPage, HomePage } from "@/system/route"
import { ThemeSelect } from "@/system/theme"
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
      <header className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-5xl items-center justify-between rounded-md border px-3 py-2 backdrop-blur-sm">
        <HomePage.Link>
          <h2 className="text-2xl">Guppy</h2>
        </HomePage.Link>

        <ThemeSelect />
      </header>

      {children}
    </div>
  )
}
