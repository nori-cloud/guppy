import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CurrentUser } from "@/db/model"
import { cn } from "@/lib/utils"
import { getInitials } from "@/system/formatter"
import { SignOut } from "@/module/auth/component"

export async function UserMenu({
  user,
  className,
}: {
  user: CurrentUser
  className?: string
}) {
  const initials = getInitials(user.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          className={cn(
            "size-12 cursor-pointer outline-2 transition-colors hover:outline-neutral-200",
            className,
          )}
        >
          {user?.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 my-2 w-56">
        <DropdownMenuLabel>{`Hi, ${user.name}!`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut />
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
