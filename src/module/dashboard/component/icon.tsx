import { ArrowRight, Check, LucideProps, Trash, X } from "lucide-react"

const icons = {
  ["right-arrow"]: ArrowRight,
  trash: Trash,
  check: Check,
  cross: X,
}

export type Icons = keyof typeof icons
export type IconProps = {
  icon: Icons
} & LucideProps
export function Icon({ icon, ...props }: IconProps) {
  const I = icons[icon]
  return <I {...props} />
}
