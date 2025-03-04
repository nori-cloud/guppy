import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  GripVertical,
  Home,
  Loader2,
  LucideProps,
  Pencil,
  Trash,
  X,
  XCircle,
} from "lucide-react"

const icons = {
  ["arrow-left"]: ArrowLeft,
  ["arrow-right"]: ArrowRight,
  trash: Trash,
  check: Check,
  cross: X,
  spinner: Loader2,
  ["check-circle"]: CheckCircle,
  ["cross-circle"]: XCircle,
  ["grip-vertical"]: GripVertical,
  edit: Pencil,
  home: Home,
}

export type Icons = keyof typeof icons
export type IconProps = {
  icon: Icons
} & LucideProps
export function Icon({ icon, ...props }: IconProps) {
  const I = icons[icon]
  return <I {...props} />
}
