import { RouteObject } from "@/system/type"
import Link from "next/link"

export const ProfilePage: RouteObject<{ id: string }> = {
  Url: "/dashboard/profile",
  Link: ({ children, id }) => (
    <Link href={`/dashboard/profile/${id}`}>{children}</Link>
  ),
}
