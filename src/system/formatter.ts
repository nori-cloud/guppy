export function getInitials(name: string, delimiter: RegExp | string = /[ -]/) {
  return name
    .split(delimiter)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
