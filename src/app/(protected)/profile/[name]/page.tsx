import { Button } from "@/components/ui/button"
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
      <div className="flex w-80 flex-col gap-6 p-6 pr-0">
        <div className="bg-foreground flex flex-col gap-2 rounded-md p-4">
          <DashboardPage.Link>
            <Button variant="outline">Back to Dashboard</Button>
          </DashboardPage.Link>

          <h1 className="text-background text-2xl font-bold">
            Profile {profile.name}
          </h1>
        </div>

        <div className="bg-foreground flex flex-1 flex-col gap-2 rounded-md p-4">
          <form
            action={async () => {
              "use server"
              await createLink({
                profileId: profile.id,
                title: "test " + profile.links.length,
                url: "https://test.com",
                type: "generic",
                order: profile.links.length,
              })
            }}
          >
            <Button type="submit">Create test link</Button>
          </form>
        </div>
      </div>

      <div className="divide-foreground grid flex-1 grid-cols-2 gap-4 divide-x">
        <div className="flex flex-col overflow-x-clip overflow-y-auto p-6">
          <SortableLinkList
            links={profile.links}
            onOrderChange={reorderLinks}
            onLinkUpdate={updateLink}
            onLinkRemove={removeLink}
          />
        </div>

        <div className="flex items-center justify-center">
          <DevicePreview name={profile.name} links={profile.links} />
        </div>
      </div>
    </div>
  )
}
