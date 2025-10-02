import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { Asterisk, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "inline-flex items-center gap-2 font-medium leading-none transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-muted-foreground",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        destructive: "text-red-600 dark:text-red-400",
      },
      size: {
        sm: "text-xs tracking-tight",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg font-semibold",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive after:font-bold",
        false: "",
      },
      disabled: {
        true: "text-muted-foreground/50 cursor-not-allowed",
        false: "",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 transform origin-left transition-transform",
        false: "cursor-default",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
      required: false,
      disabled: false,
      interactive: false,
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      required?: boolean
      tooltip?: string
      description?: string
      icon?: React.ReactNode
    }
>(({ 
  className, 
  variant, 
  size, 
  weight,
  required = false,
  disabled = false,
  interactive = false,
  tooltip,
  description,
  icon,
  children,
  ...props 
}, ref) => {
  const [showTooltip, setShowTooltip] = React.useState(false)

  const labelContent = (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants({ variant, size, weight, required, disabled, interactive }),
        className
      )}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => tooltip && setShowTooltip(false)}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      
      {/* Label Text */}
      <span className="flex-1">{children}</span>
      
      {/* Required Indicator */}
      {required && (
        <Asterisk className="h-2.5 w-2.5 text-destructive flex-shrink-0" />
      )}
      
      {/* Tooltip Icon */}
      {tooltip && (
        <div className="relative flex-shrink-0">
          <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
          
          {/* Tooltip */}
          {showTooltip && (
            <div className={cn(
              "absolute z-50 px-3 py-2 text-xs font-normal rounded-lg shadow-lg",
              "bg-popover text-popover-foreground border",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              "min-w-32 max-w-64 text-center",
              {
                "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2": true,
              }
            )}>
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div className="border-4 border-transparent border-t-popover" />
              </div>
            </div>
          )}
        </div>
      )}
    </LabelPrimitive.Root>
  )

  if (description) {
    return (
      <div className="flex flex-col gap-1.5">
        {labelContent}
        <p className={cn(
          "text-muted-foreground leading-relaxed transition-colors duration-200",
          {
            "text-xs": size === "sm",
            "text-sm": size === "default" || size === "lg",
            "text-base": size === "xl",
            "text-muted-foreground/50": disabled,
          }
        )}>
          {description}
        </p>
      </div>
    )
  }

  return labelContent
})
Label.displayName = LabelPrimitive.Root.displayName

// Label Group Component
const LabelGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    orientation?: "vertical" | "horizontal"
    spacing?: "sm" | "default" | "lg"
  }
>(({ className, orientation = "vertical", spacing = "default", ...props }, ref) => {
  const spacingClasses = {
    sm: "gap-1.5",
    default: "gap-2.5",
    lg: "gap-3.5",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        {
          "flex-col": orientation === "vertical",
          "flex-row flex-wrap items-center": orientation === "horizontal",
        },
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  )
})
LabelGroup.displayName = "LabelGroup"

// Form Field Component that combines Label and optional elements
interface FormFieldProps {
  label: string
  required?: boolean
  tooltip?: string
  description?: string
  error?: string
  htmlFor?: string
  children: React.ReactNode
  className?: string
  variant?: VariantProps<typeof labelVariants>["variant"]
  size?: VariantProps<typeof labelVariants>["size"]
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  tooltip,
  description,
  error,
  htmlFor,
  children,
  className,
  variant = "default",
  size = "default",
}) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Label
        htmlFor={htmlFor}
        variant={variant}
        size={size}
        required={required}
        tooltip={tooltip}
        description={description}
        interactive={!!htmlFor}
      >
        {label}
      </Label>
      
      {children}
      
      {error && (
        <p className={cn(
          "text-destructive text-sm font-medium flex items-center gap-1.5",
          "animate-in fade-in-0 slide-in-from-top-1 duration-200"
        )}>
          <span className="h-1 w-1 rounded-full bg-destructive animate-pulse" />
          {error}
        </p>
      )}
    </div>
  )
}

export { Label, LabelGroup, FormField, labelVariants }