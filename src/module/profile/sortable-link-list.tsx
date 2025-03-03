"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Link } from "@/db/model"
import { cn } from "@/lib/utils"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import EditableInput from "./component/input"

export function SortableLinkList({
  links,
  onOrderChange,
  onLinkUpdate,
  onLinkRemove,
}: {
  links: Link[]
  onOrderChange: (newItems: Link[]) => void
  onLinkUpdate: (link: Link) => void
  onLinkRemove: (id: number) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id)
      const newIndex = links.findIndex((l) => l.id === over.id)

      const newItems = arrayMove(links, oldIndex, newIndex).map((l, order) => ({
        ...l,
        order,
      }))

      onOrderChange(newItems)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={links} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <SortableLinkCard
              key={link.id}
              link={link}
              onLinkUpdate={onLinkUpdate}
              onLinkRemove={onLinkRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

interface SortableCardProps {
  link: Link
  onLinkUpdate: (link: Link) => void
  onLinkRemove: (id: number) => void
}

function SortableLinkCard({
  link,
  onLinkUpdate,
  onLinkRemove,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      style={style}
      ref={setNodeRef}
      className={cn(
        "bg-foreground touch-none",
        isDragging && "z-10 opacity-80",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <EditableInput
          onSave={(title) => onLinkUpdate({ ...link, title })}
          defaultValue={link.title}
        />

        <div
          suppressHydrationWarning
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-1 hover:bg-gray-100"
        >
          <Icon icon="grip-vertical" className="size-4" />
        </div>
      </CardHeader>

      <CardContent className="">
        <EditableInput
          onSave={(url) => onLinkUpdate({ ...link, url })}
          defaultValue={link.url}
        />
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <button
          className="hover:border-background/80 border-background/20 text-background/80 hover:text-background rounded-md border p-1 transition-colors"
          onClick={() => onLinkRemove(link.id)}
        >
          <Icon icon="trash" className="size-4" />
        </button>
      </CardFooter>
    </Card>
  )
}
