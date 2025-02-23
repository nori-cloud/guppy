import type { RouteObject } from "@/system/type";
import Link from "next/link";

export const AuthRoute: Record<string, RouteObject> = {
  SignIn: {
    Url: "/auth/sign-in",
    Link: ({ children }) => {
      return <Link href={AuthRoute.SignIn.Url}>{children}</Link>;
    },
  },
  SignUp: {
    Url: "/auth/sign-up",
    Link: ({ children }) => {
      return <Link href={AuthRoute.SignUp.Url}>{children}</Link>;
    },
  },
};
