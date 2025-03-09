import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle,
  Ellipsis,
  GripVertical,
  Home,
  Image,
  Link,
  Loader2,
  LucideProps,
  Pencil,
  PencilRuler,
  Settings,
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
  settings: Settings,
  editor: PencilRuler,
  ellipsis: Ellipsis,
  generic: Link,
  image: Image,
  connection: Boxes,
}

export function Icon({
  icon,
  ...props
}: {
  icon: keyof typeof icons
} & LucideProps) {
  const I = icons[icon]
  return <I {...props} />
}

import { faSteam, faYoutube } from "@fortawesome/free-brands-svg-icons"
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"

const socialIcons = {
  youtube: faYoutube,
  steam: faSteam,
}

export function SocialIcon({
  social,
  ...props
}: { social: keyof typeof socialIcons } & Omit<FontAwesomeIconProps, "icon">) {
  return <FontAwesomeIcon icon={socialIcons[social]} {...props} />
}
