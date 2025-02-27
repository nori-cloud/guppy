import {
  ArrowRight,
  Check,
  CheckCircle,
  GripVertical,
  Loader2,
  LucideProps,
  Trash,
  X,
  XCircle,
} from "lucide-react"

const icons = {
  ["right-arrow"]: ArrowRight,
  trash: Trash,
  check: Check,
  cross: X,
  spinner: Loader2,
  ["check-circle"]: CheckCircle,
  ["cross-circle"]: XCircle,
  ["grip-vertical"]: GripVertical,
}

export type Icons = keyof typeof icons
export type IconProps = {
  icon: Icons
} & LucideProps
export function Icon({ icon, ...props }: IconProps) {
  const I = icons[icon]
  return <I {...props} />
}
