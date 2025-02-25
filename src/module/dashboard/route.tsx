import { RouteObject } from "@/system/type"
import Link from "next/link"

export const DashboardPage: RouteObject = {
  Url: "/dashboard",
  Link: ({ children }) => <Link href="/dashboard">{children}</Link>,
}
