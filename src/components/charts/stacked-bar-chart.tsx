"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CHART_COLORS } from "@/lib/constants"

interface StackedBarChartProps {
  data: Record<string, string | number>[]
  keys: string[]
  title: string
  yLabel?: string
  colors?: string[]
  colorMap?: Record<string, string>
  height?: number
}

export function StackedBarChart({
  data,
  keys,
  title,
  colors,
  colorMap,
  height = 400,
}: StackedBarChartProps) {
  const chartColors = colors || CHART_COLORS

  const config = Object.fromEntries(
    keys.map((key, i) => [
      key,
      {
        label: key,
        color: colorMap?.[key] || chartColors[i % chartColors.length],
      },
    ])
  ) satisfies ChartConfig

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground/80 mb-4">
        {title}
      </h3>
      <ChartContainer config={config} className="w-full" style={{ height }}>
        <BarChart data={data}>
          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.06)"
          />
          <XAxis
            dataKey="period"
            tick={{ fill: "#71717A", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "#71717A", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ChartLegend content={<ChartLegendContent />} />
          {keys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colorMap?.[key] || chartColors[i % chartColors.length]}
              radius={i === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
