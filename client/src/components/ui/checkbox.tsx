import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    variant?: "default" | "primary" | "success" | "warning" | "destructive"
    size?: "sm" | "default" | "lg"
    label?: string
    description?: string
  }
>(({ 
  className, 
  variant = "default",
  size = "default",
  label,
  description,
  ...props 
}, ref) => {
  const variants = {
    default: "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
    primary: "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white",
    success: "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white",
    warning: "data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:text-white",
    destructive: "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 data-[state=checked]:text-white",
  }

  const sizes = {
    sm: "h-3 w-3 rounded-xs",
    default: "h-4 w-4 rounded-sm",
    lg: "h-5 w-5 rounded-md",
  }

  const iconSizes = {
    sm: "h-2.5 w-2.5",
    default: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 border border-primary/30 bg-background transition-all duration-200",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:scale-105 hover:shadow-md active:scale-95",
        "data-[state=checked]:shadow-lg data-[state=checked]:scale-105",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current transition-all duration-200",
          "data-[state=checked]:animate-in data-[state=checked]:fade-in-0 data-[state=checked]:zoom-in-75",
          "data-[state=indeterminate]:animate-in data-[state=indeterminate]:fade-in-0 data-[state=indeterminate]:zoom-in-75"
        )}
      >
        {props.checked === "indeterminate" ? (
          <Minus className={cn("font-bold", iconSizes[size])} strokeWidth={3} />
        ) : (
          <Check className={cn("font-bold", iconSizes[size])} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (label || description) {
    return (
      <div className="flex items-start gap-3 group cursor-pointer">
        {checkboxElement}
        <div 
          className="flex flex-col gap-1 flex-1"
          onClick={() => {
            const event = new Event('click', { bubbles: true })
            ref?.current?.dispatchEvent(event)
          }}
        >
          {label && (
            <label 
              className={cn(
                "text-sm font-medium leading-none cursor-pointer",
                "transition-colors duration-200",
                "group-hover:text-foreground/90",
                "text-foreground/80",
                {
                  "text-base": size === "lg",
                  "text-xs": size === "sm",
                }
              )}
              htmlFor={props.id}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={cn(
              "text-muted-foreground leading-relaxed",
              "transition-colors duration-200",
              "group-hover:text-muted-foreground/80",
              {
                "text-sm": size === "lg" || size === "default",
                "text-xs": size === "sm",
              }
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }

  return checkboxElement
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Checkbox Group Component
const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    orientation?: "vertical" | "horizontal"
  }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex gap-4",
      {
        "flex-col": orientation === "vertical",
        "flex-row flex-wrap": orientation === "horizontal",
      },
      className
    )}
    {...props}
  />
))
CheckboxGroup.displayName = "CheckboxGroup"

// Checkbox Card Component for advanced layouts
const CheckboxCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, checked, onCheckedChange, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300",
      "bg-card hover:bg-accent/50",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "hover:scale-105 hover:shadow-lg active:scale-95",
      checked 
        ? "border-primary bg-primary/5 shadow-md scale-105" 
        : "border-muted bg-background",
      className
    )}
    onClick={() => onCheckedChange?.(!checked)}
    {...props}
  >
    {children}
    <div className={cn(
      "absolute top-2 right-2 h-3 w-3 rounded-full border transition-all duration-300",
      checked 
        ? "bg-primary border-primary scale-125" 
        : "bg-background border-muted-foreground/30"
    )}>
      {checked && (
        <div className="w-full h-full bg-primary rounded-full animate-in zoom-in-75 duration-200" />
      )}
    </div>
  </div>
))
CheckboxCard.displayName = "CheckboxCard"

export { Checkbox, CheckboxGroup, CheckboxCard }