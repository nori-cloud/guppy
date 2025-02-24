
import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { baseConfig } from "./system/auth.config";

/**
 * Middleware are running in the edge runtime
 * 
 * before `runtime: 'nodejs'` is out of canary, edge compatibility is required
 * https://github.com/vercel/next.js/pull/75624
 * 
 */

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