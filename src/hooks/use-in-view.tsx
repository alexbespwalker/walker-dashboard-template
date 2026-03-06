"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Intersection Observer hook for scroll-triggered animations.
 * Adds .in-view class when element enters viewport.
 *
 * Usage:
 *   const ref = useInView()
 *   <div ref={ref} className="scroll-reveal">...</div>
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
) {
  const ref = useRef<T>(null)
  const [, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view")
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
