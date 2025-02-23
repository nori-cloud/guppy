
export type RouteObject = {
  Url: string;
  Link: ({ children }: { children: React.ReactNode }) => React.ReactNode;
};
