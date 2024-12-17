import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token && ["/login", "/register"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (
    ["/dashboard"].includes(req.nextUrl.pathname) &&
    (!token || token.user.role !== "admin")
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard"],
};
