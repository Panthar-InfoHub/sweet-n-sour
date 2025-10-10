import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "error" | "warning" | "sale"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-muted text-foreground",
    success: "bg-success text-white",
    error: "bg-error text-white",
    warning: "bg-warning text-white",
    sale: "bg-sale text-sale-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
