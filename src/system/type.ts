export type RouteObject<
  TParams extends Record<string, string> = Record<string, string>,
> = {
  Url: string
  Link: ({
    children,
  }: { children: React.ReactNode } & TParams) => React.ReactNode
}
