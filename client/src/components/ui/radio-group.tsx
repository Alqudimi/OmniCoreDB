import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Check, Circle, LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const radioGroupVariants = cva(
  "grid transition-all duration-200",
  {
    variants: {
      orientation: {
        vertical: "gap-3",
        horizontal: "gap-4 flex flex-row flex-wrap",
      },
      spacing: {
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-4",
      }
    },
    defaultVariants: {
      orientation: "vertical",
      spacing: "md",
    },
  }
)

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> &
    VariantProps<typeof radioGroupVariants>
>(({ className, orientation, spacing, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(radioGroupVariants({ orientation, spacing }), className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioItemVariants = cva(
  "relative flex items-center transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "border-2 border-muted-foreground/30 bg-background",
          "hover:border-primary/50 hover:bg-accent/30 hover:scale-105",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary/10",
          "data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/25"
        ],
        filled: [
          "border-2 border-muted-foreground/20 bg-muted/30",
          "hover:bg-muted/50 hover:border-primary/30 hover:scale-105",
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
          "data-[state=checked]:text-primary-foreground",
          "data-[state=checked]:shadow-xl data-[state=checked]:shadow-primary/30"
        ],
        outline: [
          "border-2 border-muted-foreground/40 bg-transparent",
          "hover:border-primary hover:bg-primary/5 hover:scale-105",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5",
          "data-[state=checked]:ring-2 data-[state=checked]:ring-primary/20"
        ],
        soft: [
          "border border-muted-foreground/20 bg-gradient-to-br from-background to-muted/20",
          "hover:from-accent/30 hover:to-accent/50 hover:scale-105",
          "data-[state=checked]:from-primary/10 data-[state=checked]:to-primary/20",
          "data-[state=checked]:border-primary/30 data-[state=checked]:shadow-md"
        ]
      },
      size: {
        sm: "px-3 py-2 rounded-lg text-sm gap-2",
        md: "px-4 py-3 rounded-xl text-base gap-3",
        lg: "px-5 py-4 rounded-2xl text-lg gap-4",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent",
        false: "cursor-pointer"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
)

const radioIndicatorVariants = cva(
  "flex items-center justify-center rounded-full border-2 transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "border-muted-foreground/40 bg-background",
          "group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary",
          "group-data-[state=checked]:shadow-sm"
        ],
        filled: [
          "border-muted-foreground/30 bg-muted",
          "group-data-[state=checked]:border-primary-foreground group-data-[state=checked]:bg-primary-foreground",
          "group-data-[state=checked]:shadow-sm"
        ],
        outline: [
          "border-muted-foreground/40 bg-transparent",
          "group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary",
          "group-data-[state=checked]:shadow-sm"
        ],
        soft: [
          "border-muted-foreground/30 bg-background/80",
          "group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary",
          "group-data-[state=checked]:shadow-sm"
        ]
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof radioItemVariants> & {
      label?: string
      description?: string
      icon?: LucideIcon
    }
>(({ 
  className, 
  variant, 
  size, 
  disabled,
  label,
  description,
  icon: Icon,
  ...props 
}, ref) => {
  const Comp = Icon ? 'div' : RadioGroupPrimitive.Item
  
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        radioItemVariants({ variant, size, disabled }),
        "group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:scale-95",
        !label && "aspect-square h-4 w-4",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {/* Radio Indicator */}
      <div className={cn(
        radioIndicatorVariants({ variant, size }),
        "flex-shrink-0"
      )}>
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          {variant === 'filled' ? (
            <Check className={cn(
              "text-primary-foreground fill-current",
              {
                "h-2 w-2": size === "sm",
                "h-2.5 w-2.5": size === "md",
                "h-3 w-3": size === "lg",
              }
            )} strokeWidth={3} />
          ) : (
            <div className={cn(
              "rounded-full bg-current animate-in zoom-in-75 duration-200",
              {
                "h-1.5 w-1.5": size === "sm",
                "h-2 w-2": size === "md",
                "h-2.5 w-2.5": size === "lg",
              }
            )} />
          )}
        </RadioGroupPrimitive.Indicator>
      </div>

      {/* Content */}
      {(label || Icon) && (
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className={cn(
                "text-muted-foreground transition-colors duration-200",
                "group-data-[state=checked]:text-primary",
                {
                  "h-3.5 w-3.5": size === "sm",
                  "h-4 w-4": size === "md",
                  "h-5 w-5": size === "lg",
                }
              )} />
            )}
            {label && (
              <span className={cn(
                "font-medium transition-colors duration-200",
                "text-foreground/90 group-data-[state=checked]:text-foreground",
                "group-data-[state=checked]:font-semibold"
              )}>
                {label}
              </span>
            )}
          </div>
          {description && (
            <p className={cn(
              "text-muted-foreground transition-colors duration-200",
              "group-data-[state=checked]:text-muted-foreground/80",
              "mt-1 leading-relaxed",
              {
                "text-xs": size === "sm",
                "text-sm": size === "md",
                "text-base": size === "lg",
              }
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Card Radio Component
const RadioCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    variant?: "default" | "filled"
  }
>(({ 
  className, 
  checked, 
  onCheckedChange, 
  variant = "default",
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300",
      "bg-card hover:bg-accent/30",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "hover:scale-105 active:scale-95",
      checked 
        ? cn(
            "border-primary bg-primary/5 shadow-xl scale-105",
            variant === 'filled' && "bg-primary text-primary-foreground border-primary"
          )
        : "border-muted bg-background hover:border-primary/30",
      className
    )}
    onClick={() => onCheckedChange?.(!checked)}
    {...props}
  >
    {children}
    <div className={cn(
      "absolute top-4 right-4 h-5 w-5 rounded-full border-2 transition-all duration-300",
      checked 
        ? "bg-primary border-primary shadow-sm" 
        : "bg-background border-muted-foreground/30",
      "flex items-center justify-center"
    )}>
      {checked && (
        <div className="h-2 w-2 rounded-full bg-primary-foreground animate-in zoom-in-75 duration-200" />
      )}
    </div>
  </div>
))
RadioCard.displayName = "RadioCard"

export { RadioGroup, RadioGroupItem, RadioCard, radioGroupVariants, radioItemVariants }