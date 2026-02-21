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
          "border-transparent bg-emerald-500/10 text-emerald-500": variant === "success",
          "border-transparent bg-yellow-500/10 text-yellow-500": variant === "warning",
          "border-transparent bg-red-500/10 text-red-500": variant === "danger",
          "text-foreground border-border": variant === "outline"
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
