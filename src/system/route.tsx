import { Metadata } from "next"
import Link from "next/link"

type RouteObject<TParams extends object = object> = {
  Metadata: Metadata
  Url: string
  Link: ({
    children,
  }: { children: React.ReactNode } & TParams) => React.ReactNode
}

export const HomePage: RouteObject = {
  Metadata: {
    title: "Guppy",
  },
  Url: "/",
  Link: ({ children }) => <Link href="/">{children}</Link>,
}

export const SignInPage: RouteObject = {
  Metadata: {
    title: "Guppy | Sign in",
  },
  Url: "/auth/sign-in",
  Link: ({ children }) => {
    return <Link href={SignInPage.Url}>{children}</Link>
  },
}

export const SignUpPage: RouteObject = {
  Metadata: {
    title: "Guppy | Sign up",
  },
  Url: "/auth/sign-up",
  Link: ({ children }) => {
    return <Link href={SignUpPage.Url}>{children}</Link>
  },
}

export const DashboardPage: RouteObject = {
  Metadata: {
    title: "Guppy | Dashboard",
  },
  Url: "/dashboard",
  Link: ({ children }) => <Link href="/dashboard">{children}</Link>,
}

export const ProfilePage: RouteObject<{ name: string }> = {
  Metadata: {
    title: "Guppy | Profile",
  },
  Url: "/profile",
  Link: ({ children, name }) => (
    <Link href={`${ProfilePage.Url}/${name}`}>{children}</Link>
  ),
}
