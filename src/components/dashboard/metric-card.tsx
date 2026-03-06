import { PRIMARY } from "@/lib/constants"

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string
}

export function MetricCard({ label, value, delta }: MetricCardProps) {
  return (
    <div className="glass-card glass-card-hover rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/90 mb-2.5">
        {label}
      </p>
      <p className="text-[32px] font-bold leading-none text-white metric-value-enter">
        {value}
      </p>
      {delta && (
        <p className="text-sm mt-1.5" style={{ color: PRIMARY }}>
          {delta}
        </p>
      )}
    </div>
  )
}
