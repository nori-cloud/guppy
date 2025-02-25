export type RouteObject<
  TParams extends object = object,
> = {
  Url: string
  Link: ({
    children,
  }: { children: React.ReactNode } & TParams) => React.ReactNode
}
