"use client"

import { Link } from "@/db/model"
import { DraggableCardList } from "@/module/profile/components/draggable-list"

export default function LinkList({ links }: { links: Link[] }) {
  console.debug("links", links)

  return (
    <DraggableCardList
      initialItems={links.map((link) => ({
        id: link.id.toString(),
        title: link.title,
        content: link.url,
      }))}
      onOrderChange={(newItems) => {
        console.log("New order:", newItems)
        // Here you would typically save the new order to your backend
      }}
    />
  )
}
