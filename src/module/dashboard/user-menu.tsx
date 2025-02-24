import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrentUser } from "@/db/user";
import { signOut } from "@/system/auth";

export default function UserMenu({ user }: { user: CurrentUser }) {
  if (!user) {
    return <></>;
  }

  const initial = user.name
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="fixed bottom-6 left-6 size-12 cursor-pointer outline-2 transition-colors hover:outline-neutral-200">
          {user?.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mx-4 my-2">
        <DropdownMenuLabel>{`Hi, ${user.name}!`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">Sign out</button>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
