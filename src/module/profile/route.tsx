import { RouteObject } from "@/system/type"
import Link from "next/link"

export const ProfilePage: RouteObject<{ name: string }> = {
  Url: "/profile",
  Link: ({ children, name }) => (
    <Link href={`${ProfilePage.Url}/${name}`}>{children}</Link>
  ),
}
