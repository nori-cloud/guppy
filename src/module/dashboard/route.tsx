import { RouteObject } from "@/system/type";
import Link from "next/link";

export const DashboardRoute: Record<string, RouteObject> = {
  Index: {
    Url: "/dashboard",
    Link: ({ children }) => <Link href="/dashboard">{children}</Link>,
  },
};
