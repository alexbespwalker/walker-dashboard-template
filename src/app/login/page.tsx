"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PROJECT_NAME,
  PROJECT_SUBTITLE,
  PROJECT_LOGO_LETTER,
  PRIMARY,
  PRIMARY_DARK,
  DEFAULT_ROUTE,
} from "@/lib/constants"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push(DEFAULT_ROUTE)
      router.refresh()
    } else {
      setError("Incorrect password")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ backgroundColor: `${PRIMARY}08` }}
        />
      </div>
      <div className="w-full max-w-[400px] glass-card rounded-2xl relative z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 fill-mode-both">
        <div className="text-center space-y-3 p-8 pb-2">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/10"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
              boxShadow: `0 10px 15px -3px ${PRIMARY}26`,
            }}
          >
            <span className="text-white text-2xl font-bold">
              {PROJECT_LOGO_LETTER}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{PROJECT_NAME}</h1>
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-widest mt-1">
              {PROJECT_SUBTITLE}
            </p>
          </div>
        </div>
        <div className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter dashboard password"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full text-white shadow-lg transition-all duration-300"
              style={{
                background: `linear-gradient(to right, ${PRIMARY}, ${PRIMARY_DARK})`,
                boxShadow: `0 10px 15px -3px ${PRIMARY}1A`,
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
