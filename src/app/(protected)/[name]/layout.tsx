import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { CurrentUser, Profile } from "@/db/model"
import { getCurrentUser } from "@/db/user"
import { UserMenu } from "@/module/dashboard/user-menu"
import { getProfileByName } from "@/module/editor/action"
import { DevicePreview } from "@/module/editor/component/device-preview"
import {
  ConnectionPage,
  DashboardPage,
  EditorPage,
  HomePage,
  SettingsPage,
} from "@/system/route"
import { ThemeToggle } from "@/system/theme"
import { redirect } from "next/navigation"
import React from "react"
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect(HomePage.Url())
  }

  const profile = await getProfileByName(name)

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Toolbar profile={profile} user={currentUser} />

      <div className="flex flex-1 flex-col-reverse gap-4 md:flex-row md:divide-x md:overflow-hidden">
        {children}

        <div className="flex flex-2 items-center justify-center p-4">
          <DevicePreview profileName={name} />
        </div>
      </div>
    </div>
  )
}

function Toolbar({ profile, user }: { profile: Profile; user: CurrentUser }) {
  return (
    <div className="flex flex-wrap justify-between gap-6 border-b p-4">
      <div className="flex flex-row items-center gap-2">
        <DashboardPage.Link>
          <Button title="Go back toDashboard">
            <Icon icon="arrow-left" />
          </Button>
        </DashboardPage.Link>

        <h1 className="text-2xl font-semibold">{profile.name}</h1>
      </div>

      <menu className="ml-auto flex flex-row gap-2">
        <ThemeToggle />

        <EditorPage.Link name={profile.name}>
          <Button title="Editor">
            <Icon icon="editor" />
          </Button>
        </EditorPage.Link>

        <ConnectionPage.Link name={profile.name}>
          <Button title="Connection">
            <Icon icon="connection" />
          </Button>
        </ConnectionPage.Link>

        <SettingsPage.Link name={profile.name}>
          <Button title="Settings">
            <Icon icon="settings" />
          </Button>
        </SettingsPage.Link>

        <UserMenu className="size-9" user={user} />
      </menu>
    </div>
  )
}
