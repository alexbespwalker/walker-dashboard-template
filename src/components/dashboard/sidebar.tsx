"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Menu, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  PROJECT_NAME,
  PROJECT_SUBTITLE,
  PROJECT_LOGO_LETTER,
  PRIMARY,
  PRIMARY_DARK,
} from "@/lib/constants"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

/**
 * TEMPLATE: Update this array with your dashboard pages.
 */
export const navItems: NavItem[] = [
  { href: "/example", label: "Example", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (
    <>
      <div className="p-6 text-center">
        <div
          className="mx-auto w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
            boxShadow: `0 10px 15px -3px ${PRIMARY}26`,
          }}
        >
          <span className="text-white text-lg font-bold">
            {PROJECT_LOGO_LETTER}
          </span>
        </div>
        <h2 className="mt-2 text-lg font-bold" style={{ color: PRIMARY }}>
          {PROJECT_NAME}
        </h2>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
          {PROJECT_SUBTITLE}
        </p>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent h-px border-0" />

      <p className="px-6 pt-4 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
        Navigation
      </p>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-white/[0.06]"
                  : "text-foreground/50 hover:text-foreground hover:bg-white/[0.06] transition-all duration-200"
              }`}
              style={active ? { color: PRIMARY } : undefined}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                  style={{
                    backgroundColor: PRIMARY,
                    boxShadow: `0 0 8px ${PRIMARY}40`,
                  }}
                />
              )}
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 text-center">
        <p className="text-[10px] text-muted-foreground/60">
          Data refreshes every 5 min
        </p>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-secondary/80 backdrop-blur md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop: always visible, mobile: slide in */}
      <aside
        className={`fixed md:static z-40 w-60 shrink-0 border-r border-border bg-[#0A0A0F] flex flex-col h-screen transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {nav}
      </aside>
    </>
  )
}
