import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Profile } from "@/db/model"
import { getProfileByName } from "@/module/editor/action"
import { DevicePreview } from "@/module/editor/component/device-preview"
import { DashboardPage, EditorPage, SettingsPage } from "@/system/route"
import React from "react"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await getProfileByName(name)

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Toolbar profile={profile} />

      <div className="flex flex-1 flex-col-reverse gap-4 overflow-hidden md:flex-row md:divide-x">
        {children}

        <div className="flex flex-2 items-center justify-center p-6">
          <DevicePreview profileName={profile.name} />
        </div>
      </div>
    </div>
  )
}

function Toolbar({ profile }: { profile: Profile }) {
  return (
    <div className="flex justify-between gap-6 border-b p-4">
      <div className="flex flex-row items-center gap-2">
        <DashboardPage.Link>
          <Button title="Go back toDashboard">
            <Icon icon="arrow-left" />
          </Button>
        </DashboardPage.Link>

        <h1 className="text-2xl font-semibold">{profile.name}</h1>
      </div>

      <menu className="flex flex-row gap-2">
        <EditorPage.Link name={profile.name}>
          <Button title="Editor">
            <Icon icon="editor" />
          </Button>
        </EditorPage.Link>

        <SettingsPage.Link name={profile.name}>
          <Button title="Settings">
            <Icon icon="settings" />
          </Button>
        </SettingsPage.Link>
      </menu>
    </div>
  )
}
