"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CHART_COLORS } from "@/lib/constants"

interface SimpleBarChartProps {
  data: { name: string; value: number; fill?: string }[]
  title: string
  height?: number
}

export function SimpleBarChart({
  data,
  title,
  height = 350,
}: SimpleBarChartProps) {
  const colored = data.map((d, i) => ({
    ...d,
    fill: d.fill || CHART_COLORS[i % CHART_COLORS.length],
  }))

  const config = Object.fromEntries(
    colored.map((d) => [d.name, { label: d.name, color: d.fill }])
  ) satisfies ChartConfig

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground/80 mb-4">
        {title}
      </h3>
      <ChartContainer config={config} className="w-full" style={{ height }}>
        <BarChart data={colored}>
          <defs>
            {colored.map((d) => (
              <linearGradient key={d.name} id={`gradient-bar-${d.name.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={d.fill} stopOpacity={0.9} />
                <stop offset="100%" stopColor={d.fill} stopOpacity={0.4} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.06)"
          />
          <XAxis
            dataKey="name"
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
          <Bar dataKey="value" radius={[6, 6, 0, 0]} opacity={0.92}>
            {colored.map((entry) => (
              <rect key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
