import { startOfWeek, startOfMonth, startOfDay, format, parseISO } from "date-fns"

export type Granularity = "Daily" | "Weekly" | "Monthly"

function getPeriod(date: Date, granularity: Granularity): Date {
  switch (granularity) {
    case "Daily":
      return startOfDay(date)
    case "Weekly":
      return startOfWeek(date, { weekStartsOn: 0 })
    case "Monthly":
      return startOfMonth(date)
  }
}

function formatPeriod(date: Date, granularity: Granularity): string {
  switch (granularity) {
    case "Daily":
      return format(date, "MMM d")
    case "Weekly":
      return format(date, "MMM d")
    case "Monthly":
      return format(date, "MMM yyyy")
  }
}

export function aggregateByPeriod(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  dateCol: string,
  groupCol: string,
  valueCol: string,
  aggType: "count" | "sum",
  granularity: Granularity
): { chartData: Record<string, string | number>[]; keys: string[] } {
  const map = new Map<string, Map<string, number>>()
  const periodDates = new Map<string, Date>()
  const allKeys = new Set<string>()

  for (const row of data) {
    const dateVal = row[dateCol]
    if (!dateVal) continue
    const date =
      typeof dateVal === "string" ? parseISO(dateVal) : (dateVal as Date)
    const period = getPeriod(date, granularity)
    const periodKey = period.toISOString()
    const groupValue = String(row[groupCol] || "Unknown")

    allKeys.add(groupValue)
    periodDates.set(periodKey, period)

    if (!map.has(periodKey)) map.set(periodKey, new Map())
    const periodMap = map.get(periodKey)!

    if (aggType === "count") {
      periodMap.set(groupValue, (periodMap.get(groupValue) || 0) + 1)
    } else {
      const val = Number(row[valueCol]) || 0
      periodMap.set(groupValue, (periodMap.get(groupValue) || 0) + val)
    }
  }

  const sortedPeriods = [...map.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )
  const keys = [...allKeys].sort()

  const chartData = sortedPeriods.map(([periodKey, groupMap]) => {
    const period = periodDates.get(periodKey)!
    const entry: Record<string, string | number> = {
      period: formatPeriod(period, granularity),
    }
    for (const key of keys) {
      entry[key] = groupMap.get(key) || 0
    }
    return entry
  })

  return { chartData, keys }
}
