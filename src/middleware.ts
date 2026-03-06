import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/login" || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const token = request.cookies.get("session")?.value
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const session = await decrypt(token)
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
