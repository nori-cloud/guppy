import { RouteObject } from "@/system/type"
import Link from "next/link"

export const ProfilePage: RouteObject<{ id: string }> = {
  Url: "/profile",
  Link: ({ children, id }) => (
    <Link href={`${ProfilePage.Url}/${id}`}>{children}</Link>
  ),
}
