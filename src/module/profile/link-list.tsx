"use client"

import { Link } from "@/db/model"
import { DraggableCardList } from "@/module/profile/components/draggable-list"

export default function LinkList({
  links,
  onOrderChange,
}: {
  links: Link[]
  onOrderChange: (newItems: Link[]) => void
}) {
  return (
    <DraggableCardList
      initialItems={links}
      onOrderChange={(newItems) => {
        console.debug("New order:", newItems)
        onOrderChange(newItems)
      }}
    />
  )
}
