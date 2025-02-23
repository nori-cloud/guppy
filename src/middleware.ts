export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Match all routes except these
    "/((?!api|_next/static|_next/image|favicon.ico|auth/|$).*)",
  ],
};