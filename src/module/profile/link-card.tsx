"use client"

import { type Link } from "@/db/model"

export function LinkCard({ link }: { link: Link }) {
  switch (link.type) {
    case "generic":
      return <GenericLink link={link} />

    default:
      return <></>
  }
}

function GenericLink({ link }: { link: Link }) {
  return (
    <div className="flex items-center justify-between gap-1 overflow-clip rounded-lg bg-zinc-800 p-1 transition-colors hover:bg-zinc-700">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 p-2 text-left text-sm"
      >
        {link.title}
      </a>
    </div>
  )
}
