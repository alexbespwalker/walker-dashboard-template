"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PRIMARY } from "@/lib/constants"

interface Column {
  key: string
  label: string
  format?: (value: unknown) => string
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  defaultSort?: string
  defaultSortDesc?: boolean
  maxRows?: number
}

export function DataTable({
  columns,
  data,
  defaultSort,
  defaultSortDesc = true,
  maxRows,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState(defaultSort || columns[0]?.key)
  const [sortDesc, setSortDesc] = useState(defaultSortDesc)

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDesc ? bVal - aVal : aVal - bVal
    }
    const cmp = String(aVal).localeCompare(String(bVal))
    return sortDesc ? -cmp : cmp
  })

  const display = maxRows ? sorted.slice(0, maxRows) : sorted

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortDesc(!sortDesc)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-white/[0.06] border-b border-white/[0.06]">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-wider text-foreground/60"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1" style={{ color: PRIMARY }}>
                    {sortDesc ? "\u2193" : "\u2191"}
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {display.map((row, i) => (
            <TableRow key={i} className="hover:bg-white/[0.05] even:bg-white/[0.02] transition-colors duration-150 border-b border-white/[0.04]">
              {columns.map((col) => (
                <TableCell key={col.key} className={`text-sm ${col.className || ""}`}>
                  {col.format
                    ? col.format(row[col.key])
                    : String(row[col.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
