import { Button } from "@/components/ui/button"
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
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile {profile.name}</h1>

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

      <div className="grid grid-cols-2 gap-4">
        <SortableLinkList
          links={profile.links}
          onOrderChange={reorderLinks}
          onLinkUpdate={updateLink}
          onLinkRemove={removeLink}
        />

        <DevicePreview name={profile.name} links={profile.links} />
      </div>
    </div>
  )
}
