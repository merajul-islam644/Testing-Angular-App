import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../shared/ui/dropdown-menu";

export const rangeOptions = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "custom", label: "Custom range" }
] as const;

export type RangeValue = (typeof rangeOptions)[number]["value"];

export function RangeSelector({ value, onChange }: { value: RangeValue; onChange: (value: RangeValue) => void }) {
  const current = rangeOptions.find((option) => option.value === value) ?? rangeOptions[1];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="range-selector" aria-label="Select date range">
        {current.label}
        <ChevronDown size={15} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {rangeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={option.value === value ? "text-[hsl(var(--primary))] font-semibold" : undefined}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}