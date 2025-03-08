import { Metadata } from "next"
import NextLink from "next/link"
import { AnchorHTMLAttributes } from "react"

type RouteObject<TParams extends object = object> = {
  Metadata: Metadata
  Url: (params?: TParams) => string
  Link: (
    params: {
      children: React.ReactNode
    } & AnchorHTMLAttributes<HTMLAnchorElement> &
      TParams,
  ) => React.ReactNode
}

type LinkProps<TParams extends object = object> = {
  children: React.ReactNode
  href: string
} & AnchorHTMLAttributes<HTMLAnchorElement> &
  TParams
function Link<TParams extends object = object>({
  children,
  href,
  ...props
}: LinkProps<TParams>) {
  return (
    <NextLink {...props} href={href}>
      {children}
    </NextLink>
  )
}

export const HomePage: RouteObject = {
  Metadata: {
    title: "Guppy",
  },
  Url: () => "/",
  Link: ({ children }) => <Link href={HomePage.Url()}>{children}</Link>,
}

export const SignInPage: RouteObject = {
  Metadata: {
    title: "Guppy | Sign in",
  },
  Url: () => "/auth/sign-in",
  Link: ({ children }) => <Link href={SignInPage.Url()}>{children}</Link>,
}

export const SignUpPage: RouteObject = {
  Metadata: {
    title: "Guppy | Sign up",
  },
  Url: () => "/auth/sign-up",
  Link: ({ children }) => <Link href={SignUpPage.Url()}>{children}</Link>,
}

export const DashboardPage: RouteObject = {
  Metadata: {
    title: "Guppy | Dashboard",
  },
  Url: () => "/dashboard",
  Link: ({ children }) => <Link href={DashboardPage.Url()}>{children}</Link>,
}

export const EditorPage: RouteObject<{ name: string }> = {
  Metadata: {
    title: "Guppy | Editor",
  },
  Url: (params) => `/${params?.name}/editor`,
  Link: ({ children, name }) => (
    <Link href={EditorPage.Url({ name })}>{children}</Link>
  ),
}

export const SettingsPage: RouteObject<{ name: string }> = {
  Metadata: {
    title: "Guppy | Settings",
  },
  Url: (params) => `/${params?.name}/settings`,
  Link: ({ children, name }) => (
    <Link href={SettingsPage.Url({ name })}>{children}</Link>
  ),
}
