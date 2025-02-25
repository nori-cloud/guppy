"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useState } from "react"

interface CardItem {
  id: string
  title: string
  content: string
}

interface SortableCardProps {
  item: CardItem
}

function SortableCard({ item }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-md">{item.title}</CardTitle>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-1 hover:bg-gray-100"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">{item.content}</CardContent>
      </Card>
    </div>
  )
}

interface DraggableCardListProps {
  initialItems?: CardItem[]
  onOrderChange?: (items: CardItem[]) => void
  className?: string
}

export function DraggableCardList({
  initialItems = [
    { id: "1", title: "Card 1", content: "This is the first card content" },
    { id: "2", title: "Card 2", content: "This is the second card content" },
    { id: "3", title: "Card 3", content: "This is the third card content" },
    { id: "4", title: "Card 4", content: "This is the fourth card content" },
  ],
  onOrderChange,
  className,
}: DraggableCardListProps) {
  const [items, setItems] = useState<CardItem[]>(initialItems)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        if (onOrderChange) {
          onOrderChange(newItems)
        }

        return newItems
      })
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-xl", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
