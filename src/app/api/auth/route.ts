import { NextRequest, NextResponse } from "next/server"
import { encrypt } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = await encrypt({ authenticated: true })

  const response = NextResponse.json({ success: true })
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  })

  return response
}
