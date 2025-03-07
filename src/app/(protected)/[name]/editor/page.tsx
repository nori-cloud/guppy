import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Link, Profile } from "@/db/model"
import { cn } from "@/lib/utils"
import {
  createLink,
  getProfileByName,
  removeLink,
  reorderLinks,
  updateLink,
} from "@/module/editor/action"
import { DevicePreview } from "@/module/editor/component/device-preview"
import { SortableLinkList } from "@/module/editor/sortable-link-list"
import { DashboardPage, EditorPage } from "@/system/route"

export const metadata = EditorPage.Metadata

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await getProfileByName(name)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar profile={profile} />

      <div className="flex flex-1 flex-col-reverse gap-4 md:flex-row md:divide-x">
        <LinkEditor
          className="flex-3 p-6"
          links={profile.links}
          onCreateLink={async () => {
            "use server"

            await createLink({
              profileId: profile.id,
              title: "",
              url: "",
              type: "generic",
              order: profile.links.length,
            })
          }}
        />

        <div className="flex flex-2 items-center justify-center p-6">
          <DevicePreview profileName={profile.name} />
        </div>
      </div>
    </div>
  )
}

function Toolbar({ profile }: { profile: Profile }) {
  return (
    <div className="flex gap-6 border-b p-4">
      <div className="flex flex-row items-center gap-2">
        <DashboardPage.Link>
          <Button>
            <Icon icon="arrow-left" />
          </Button>
        </DashboardPage.Link>

        <h1 className="text-2xl font-semibold">{profile.name}</h1>
      </div>
    </div>
  )
}

function LinkEditor({
  links,
  ...props
}: {
  className?: string
  links: Link[]
  onCreateLink: () => Promise<void>
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-x-clip overflow-y-auto",
        props.className,
      )}
    >
      <Card className="p-4">
        <form action={props.onCreateLink}>
          <Button type="submit">New Link</Button>
        </form>
      </Card>

      <SortableLinkList
        links={links}
        onOrderChange={reorderLinks}
        onLinkUpdate={updateLink}
        onLinkRemove={removeLink}
      />
    </div>
  )
}
