import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline"
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-[#171717] bg-[#0A0A0A] text-[#D4D4D4]",
  success: "border-[#737373] bg-[#171717] text-[#FAFAFA]",
  warning: "border-[#737373] bg-[#0A0A0A] text-[#D4D4D4]",
  danger: "border-[#525252] bg-[#171717] text-[#FAFAFA]",
  outline: "border-[#171717] bg-transparent text-[#737373]"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
