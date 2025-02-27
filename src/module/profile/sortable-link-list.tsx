"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { GripVertical } from "lucide-react"

export function SortableLinkList({
  links,
  onOrderChange,
}: {
  links: Link[]
  onOrderChange: (newItems: Link[]) => void
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
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={links} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <SortableLinkCard key={link.id} link={link} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

interface SortableCardProps {
  link: Link
}

function SortableLinkCard({ link }: SortableCardProps) {
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
    <div
      ref={setNodeRef}
      style={style}
      className={cn("mb-3 touch-none", isDragging && "z-10 opacity-50")}
    >
      <Card className="bg-foreground">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-md">{link.title}</CardTitle>
          <div
            suppressHydrationWarning
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-1 hover:bg-gray-100"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">{link.url}</CardContent>
      </Card>
    </div>
  )
}
