"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Granularity } from "@/lib/aggregation"

interface FilterState {
  granularity: Granularity
  setGranularity: (g: Granularity) => void
  dateRange: [string, string] | null
  setDateRange: (r: [string, string]) => void
}

const FilterContext = createContext<FilterState | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [granularity, setGranularity] = useState<Granularity>("Weekly")
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)

  return (
    <FilterContext.Provider value={{ granularity, setGranularity, dateRange, setDateRange }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilters must be used within FilterProvider")
  return ctx
}
