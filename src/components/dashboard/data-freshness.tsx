"use client"

import { useEffect, useState } from "react"

interface DataFreshnessProps {
  lastUpdated?: string | Date | null
}

export function DataFreshness({ lastUpdated }: DataFreshnessProps) {
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    if (!lastUpdated) return

    const update = () => {
      const then = new Date(lastUpdated).getTime()
      const diff = Math.floor((Date.now() - then) / 1000)
      if (diff < 60) setTimeAgo("just now")
      else if (diff < 3600) setTimeAgo(`${Math.floor(diff / 60)} min ago`)
      else if (diff < 86400) setTimeAgo(`${Math.floor(diff / 3600)}h ago`)
      else setTimeAgo(`${Math.floor(diff / 86400)}d ago`)
    }

    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [lastUpdated])

  if (!lastUpdated || !timeAgo) return null

  return (
    <span className="text-[10px] text-muted-foreground/60">
      Updated {timeAgo}
    </span>
  )
}
