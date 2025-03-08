import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  createLink,
  getProfileByName,
  removeLink,
  reorderLinks,
  updateLink,
} from "@/module/editor/action"
import { SortableLinkList } from "@/module/editor/sortable-link-list"
import { EditorPage } from "@/system/route"

export const metadata = EditorPage.Metadata

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const profile = await getProfileByName(name)

  return (
    <div className="flex flex-3 flex-col gap-6 overflow-x-clip overflow-y-auto p-6">
      <Card className="p-4">
        <form
          action={async () => {
            "use server"

            await createLink({
              profileId: profile.id,
              title: "",
              url: "",
              type: "generic",
              order: profile.links.length,
            })
          }}
        >
          <Button type="submit">New Link</Button>
        </form>
      </Card>

      <SortableLinkList
        links={profile.links}
        onOrderChange={reorderLinks}
        onLinkUpdate={updateLink}
        onLinkRemove={removeLink}
      />
    </div>
  )
}
