import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground": variant === "default",
          "border-transparent bg-[#15803D]/10 text-[#15803D]": variant === "success",
          "border-transparent bg-yellow-500/10 text-yellow-500": variant === "warning",
          "border-transparent bg-[#B91C1C]/10 text-[#B91C1C]": variant === "danger",
          "text-foreground border-border": variant === "outline"
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
