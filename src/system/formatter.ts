export function getInitials(name: string, delimiter: RegExp | string = /[ -]/) {
  return name
    .split(delimiter)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}


export function formatPlaytime(playtime: number) {
  const hours = Math.floor(playtime / 60)
  const minutes = playtime % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}
