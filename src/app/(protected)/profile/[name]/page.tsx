import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Link, Profile } from "@/db/model"
import { cn } from "@/lib/utils"
import { DashboardPage } from "@/module/dashboard/route"
import {
  createLink,
  getProfileByName,
  removeLink,
  reorderLinks,
  updateLink,
} from "@/module/profile/action"
import { DevicePreview } from "@/module/profile/component/device-preview"
import { SortableLinkList } from "@/module/profile/sortable-link-list"

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await getProfileByName(name)

  return (
    <div className="flex h-screen">
      <Sidebar profile={profile} />

      <div className="flex flex-1 gap-4 divide-x">
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

        <div className="flex flex-2 items-center justify-center">
          <DevicePreview name={profile.name} links={profile.links} />
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ profile }: { profile: Profile }) {
  return (
    <div className="flex w-80 flex-col gap-6 p-6 pr-0">
      <Card className="flex-row items-center gap-2 p-4">
        <DashboardPage.Link>
          <Button>
            <Icon icon="arrow-left" />
          </Button>
        </DashboardPage.Link>

        <h1 className="text-2xl font-semibold">{profile.name}</h1>
      </Card>

      <Card className="flex-1"></Card>
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
