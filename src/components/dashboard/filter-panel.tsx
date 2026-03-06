"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFilters } from "@/hooks/use-filters"
import type { Granularity } from "@/lib/aggregation"

interface FilterPanelProps {
  minDate: string
  maxDate: string
}

export function FilterPanel({ minDate, maxDate }: FilterPanelProps) {
  const { granularity, setGranularity, dateRange, setDateRange } = useFilters()

  const effectiveStart = dateRange?.[0] || minDate
  const effectiveEnd = dateRange?.[1] || maxDate

  return (
    <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap items-end gap-4">
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Granularity
        </Label>
        <Select
          value={granularity}
          onValueChange={(v) => setGranularity(v as Granularity)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          From
        </Label>
        <Input
          type="date"
          value={effectiveStart}
          min={minDate}
          max={maxDate}
          onChange={(e) => setDateRange([e.target.value, effectiveEnd])}
          className="w-[155px]"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          To
        </Label>
        <Input
          type="date"
          value={effectiveEnd}
          min={minDate}
          max={maxDate}
          onChange={(e) => setDateRange([effectiveStart, e.target.value])}
          className="w-[155px]"
        />
      </div>
      <div className="flex items-end gap-2">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">&nbsp;</Label>
          <div className="flex gap-1.5">
            {[
              { label: "7d", days: 7 },
              { label: "14d", days: 14 },
              { label: "30d", days: 30 },
            ].map(({ label, days }) => (
              <button
                key={label}
                onClick={() => {
                  const end = maxDate
                  const d = new Date(end)
                  d.setDate(d.getDate() - days)
                  const start = d.toISOString().slice(0, 10)
                  setDateRange([start < minDate ? minDate : start, end])
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-white/[0.1] hover:border-white/20 hover:bg-white/[0.06] text-foreground/60 hover:text-foreground transition-all duration-200"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
