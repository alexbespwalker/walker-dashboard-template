"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

interface MultiSelectProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const allSelected = selected.length === options.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between min-w-[150px] font-normal"
        >
          {allSelected ? label : `${selected.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-2 glass-card border-[rgba(255,255,255,0.06)]" align="start">
        <button
          onClick={() =>
            onChange(allSelected ? [] : [...options])
          }
          className="flex items-center w-full px-2 py-1.5 text-xs text-muted-foreground rounded hover:bg-accent mb-1"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggle(option)}
            className="flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-accent"
          >
            <div
              className={`mr-2 h-4 w-4 border rounded flex items-center justify-center shrink-0 ${
                selected.includes(option)
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/30"
              }`}
            >
              {selected.includes(option) && (
                <Check className="h-3 w-3 text-primary-foreground" />
              )}
            </div>
            {option}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
