import { NextRequest, NextResponse } from "next/server";
import { AuthRoute } from "./module/auth/route";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('next-auth.session-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL(AuthRoute.SignIn.Url, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
  ],
};