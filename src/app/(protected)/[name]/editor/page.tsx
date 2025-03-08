import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Link } from "@/db/model"
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

  const handleCreateEmptyLink = async (type: Link["type"]) => {
    "use server"

    await createLink({
      profileId: profile.id,
      title: "",
      url: "",
      type,
      order: profile.links.length,
    })
  }

  return (
    <div className="flex flex-3 flex-col gap-6 overflow-y-auto p-6">
      <Card className="flex-row gap-4 p-4">
        <form
          action={async () => {
            "use server"

            await handleCreateEmptyLink("generic")
          }}
        >
          <Button type="submit">
            <Icon icon="generic" /> New Link
          </Button>
        </form>

        <form
          action={async () => {
            "use server"

            await handleCreateEmptyLink("youtube")
          }}
        >
          <Button type="submit">
            <Icon icon="youtube" /> Youtube
          </Button>
        </form>

        <form
          action={async () => {
            "use server"

            await handleCreateEmptyLink("image")
          }}
        >
          <Button type="submit">
            <Icon icon="image" /> Image
          </Button>
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
