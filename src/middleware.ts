
import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { baseConfig } from "./system/auth.config";


export const { auth } = NextAuth(baseConfig)

export default auth((req: NextRequest) => {
  console.log("middleware", req);
});


export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
  ],
};