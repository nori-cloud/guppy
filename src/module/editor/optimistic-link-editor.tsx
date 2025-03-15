"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icon, SocialIcon } from "@/components/ui/icon"
import type { Link, LinkType, Profile } from "@/db/model"
import { useOptimistic } from "react"
import { createLink, removeLink, reorderLinks, updateLink } from "./action"
import { SortableLinkList } from "./sortable-link-list"

export function OptimisticLinkEditor({
  links,
  profile,
}: {
  links: Link[]
  profile: Profile
}) {
  const [optimisticLinks, setOptimisticLinks] = useOptimistic(links)

  const handleOptimisticCreate = async (type: LinkType) => {
    const title = ["steam"].includes(type) ? type : ""

    setOptimisticLinks([
      ...optimisticLinks,
      {
        id: 0,
        title,
        url: "",
        enabled: false,
        type,
        profileId: profile.id,
        order: optimisticLinks.length,
      },
    ])

    await createLink({
      profileId: profile.id,
      title,
      url: "",
      type,
      order: profile.links.length,
    })
  }

  const handleOptimisticReorder = async (links: Link[]) => {
    setOptimisticLinks(links)
    await reorderLinks(links)
  }

  const handleOptimisticUpdate = async (link: Link) => {
    setOptimisticLinks(
      optimisticLinks.map((l) => (l.id === link.id ? link : l)),
    )
    await updateLink(link)
  }

  const handleOptimisticRemove = async (id: number) => {
    setOptimisticLinks(optimisticLinks.filter((l) => l.id !== id))
    await removeLink(id)
  }

  return (
    <div className="flex flex-3 flex-col gap-6 p-6 md:overflow-y-auto">
      <Card className="flex-row flex-wrap gap-4 p-4">
        <form
          action={async () => {
            await handleOptimisticCreate("generic")
          }}
        >
          <Button type="submit">
            <Icon icon="generic" /> New Link
          </Button>
        </form>

        <form
          action={async () => {
            await handleOptimisticCreate("youtube")
          }}
        >
          <Button type="submit">
            <SocialIcon social="youtube" /> Youtube
          </Button>
        </form>

        <form
          action={async () => {
            await handleOptimisticCreate("image")
          }}
        >
          <Button type="submit">
            <Icon icon="image" /> Image
          </Button>
        </form>

        <form
          action={async () => {
            await handleOptimisticCreate("steam")
          }}
        >
          <Button type="submit">
            <SocialIcon social="steam" /> Steam
          </Button>
        </form>
      </Card>

      <SortableLinkList
        links={profile.links}
        onOrderChange={handleOptimisticReorder}
        onLinkUpdate={handleOptimisticUpdate}
        onLinkRemove={handleOptimisticRemove}
      />
    </div>
  )
}
