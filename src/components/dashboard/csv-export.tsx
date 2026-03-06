"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CsvExportProps {
  data: Record<string, unknown>[]
  filename?: string
  columns?: { key: string; label: string }[]
}

export function CsvExport({
  data,
  filename = "export.csv",
  columns,
}: CsvExportProps) {
  const handleExport = () => {
    if (!data.length) return

    const cols = columns || Object.keys(data[0]).map((k) => ({ key: k, label: k }))
    const header = cols.map((c) => c.label).join(",")
    const rows = data.map((row) =>
      cols
        .map((c) => {
          const val = row[c.key]
          const str = val == null ? "" : String(val)
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str
        })
        .join(",")
    )

    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="gap-1.5 text-xs"
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </Button>
  )
}
