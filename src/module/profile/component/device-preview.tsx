import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical } from "lucide-react"

interface DevicePreviewProps {
  name: string
  links: Array<{
    title: string
    url: string
  }>
}

export function DevicePreview({ name, links }: DevicePreviewProps) {
  const initials = name
    .split("-")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="shadow-foreground/80 border-foreground/80 bg-background flex aspect-[9/19] w-[300px] flex-col rounded-3xl border-4 px-6 py-8 text-white shadow-md">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Avatar className="text-background size-16 text-xl">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium">{name}</h2>
      </div>

      <div className="mb-8 flex flex-1 flex-col gap-3 overflow-y-auto">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-3 text-left transition-colors hover:bg-zinc-700"
          >
            <span className="text-sm">{link.title}</span>
            <MoreVertical className="h-5 w-5 text-white/50" />
          </a>
        ))}
      </div>

      <div className="text-foreground mt-auto text-center text-sm font-bold">
        Guppy
      </div>
    </div>
  )
}
