import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4D4D4] disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-[#FAFAFA] text-[#000000] font-semibold hover:bg-[#D4D4D4] active:scale-[0.98]": variant === "primary",
            "border border-[#171717] bg-[#0A0A0A] text-[#FAFAFA] hover:bg-[#171717] hover:border-[#737373] active:scale-[0.98]": variant === "secondary",
            "border border-[#171717] bg-transparent hover:bg-[#0A0A0A] active:scale-[0.98] text-[#FAFAFA]": variant === "outline",
            "hover:bg-[#0A0A0A] hover:text-[#FAFAFA] active:scale-[0.98] text-[#737373]": variant === "ghost",
            "bg-[#171717] text-[#FAFAFA] border border-[#737373] hover:bg-[#262626] active:scale-[0.98]": variant === "danger",
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3 text-xs": size === "sm",
            "h-11 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
