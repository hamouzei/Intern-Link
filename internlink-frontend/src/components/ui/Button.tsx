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
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] shadow-sm shadow-primary/20": variant === "primary",
            "bg-surface text-foreground hover:bg-white/10 active:scale-[0.98]": variant === "secondary",
            "border border-border bg-transparent hover:bg-surface active:scale-[0.98] text-foreground": variant === "outline",
            "hover:bg-surface hover:text-foreground active:scale-[0.98] text-muted-foreground": variant === "ghost",
            "bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-[0.98]": variant === "danger",
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
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
