"use client"

import { useMemo, useState } from "react"
import type { ExampleRow } from "@/lib/queries"
import { aggregateByPeriod } from "@/lib/aggregation"
import { useFilters } from "@/hooks/use-filters"
import { FilterPanel } from "@/components/dashboard/filter-panel"
import { MultiSelect } from "@/components/dashboard/multi-select"
import { MetricCard } from "@/components/dashboard/metric-card"
import { StackedBarChart } from "@/components/charts/stacked-bar-chart"
import { DataTable } from "@/components/tables/data-table"
import { CsvExport } from "@/components/dashboard/csv-export"
import { ErrorBoundary } from "@/components/dashboard/error-boundary"
import { PRIMARY } from "@/lib/constants"

export function ExampleClient({ data }: { data: ExampleRow[] }) {
  const { granularity, dateRange } = useFilters()

  const allCategories = useMemo(
    () => [...new Set(data.map((r) => r.category))].sort(),
    [data]
  )
  const [selectedCategories, setSelectedCategories] = useState(allCategories)

  const { minDate, maxDate } = useMemo(() => {
    const dates = data.map((r) => r.created_at).sort()
    return {
      minDate: dates[0]?.slice(0, 10) || "",
      maxDate: dates[dates.length - 1]?.slice(0, 10) || "",
    }
  }, [data])

  const filtered = useMemo(() => {
    const start = dateRange?.[0] || minDate
    const end = dateRange?.[1] || maxDate
    return data.filter((r) => {
      const d = r.created_at.slice(0, 10)
      return (
        selectedCategories.includes(r.category) && d >= start && d <= end
      )
    })
  }, [data, selectedCategories, dateRange, minDate, maxDate])

  const totalItems = filtered.length
  const totalValue = filtered.reduce((s, r) => s + r.value, 0)
  const avgValue = totalItems > 0 ? (totalValue / totalItems).toFixed(1) : "0"
  const uniqueCategories = new Set(filtered.map((r) => r.category)).size

  const { chartData, keys } = useMemo(
    () =>
      aggregateByPeriod(
        filtered,
        "created_at",
        "category",
        "value",
        "sum",
        granularity
      ),
    [filtered, granularity]
  )

  const tableData = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>()
    for (const r of filtered) {
      const stat = map.get(r.category) || { count: 0, total: 0 }
      stat.count++
      stat.total += r.value
      map.set(r.category, stat)
    }
    return [...map.entries()]
      .map(([name, s]) => ({
        Category: name,
        Items: s.count,
        "Total Value": s.total,
        Average: +(s.total / s.count).toFixed(1),
      }))
      .sort((a, b) => b["Total Value"] - a["Total Value"])
  }, [filtered])

  return (
    <ErrorBoundary>
      <div>
        <h1 className="text-2xl font-bold mb-1 text-foreground tracking-tight">
          Example Page
        </h1>
        <p className="text-sm text-muted-foreground/80 mb-6">
          Replace this with your actual page content
        </p>

        <FilterPanel minDate={minDate} maxDate={maxDate} />

        <div className="flex items-center gap-4 mb-6">
          <MultiSelect
            label="All Categories"
            options={allCategories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
          <CsvExport
            data={tableData}
            filename="example-export.csv"
            columns={[
              { key: "Category", label: "Category" },
              { key: "Items", label: "Items" },
              { key: "Total Value", label: "Total Value" },
              { key: "Average", label: "Average" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 stagger-1">
            <MetricCard label="Total Items" value={totalItems.toLocaleString()} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 stagger-2">
            <MetricCard label="Total Value" value={totalValue.toLocaleString()} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 stagger-3">
            <MetricCard label="Average" value={avgValue} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 stagger-4">
            <MetricCard label="Categories" value={uniqueCategories} />
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700" style={{ animationDelay: "300ms" }}>
            <StackedBarChart
              data={chartData}
              keys={keys}
              title={`Value by ${granularity === "Daily" ? "Day" : granularity === "Weekly" ? "Week" : "Month"} & Category`}
            />
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3 mt-8 flex items-center gap-2">
          <div className="h-5 w-0.5 rounded-full" style={{ backgroundColor: PRIMARY }} />
          Category Breakdown
        </h2>
        <DataTable
          columns={[
            { key: "Category", label: "Category" },
            { key: "Items", label: "Items" },
            { key: "Total Value", label: "Total Value" },
            { key: "Average", label: "Average" },
          ]}
          data={tableData}
          defaultSort="Total Value"
        />
      </div>
    </ErrorBoundary>
  )
}
