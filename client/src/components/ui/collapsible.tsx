"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Minus,
  ArrowDown,
  ArrowUp,
  Sparkles,
  Zap
} from "lucide-react"

import { cn } from "@/lib/utils"

const Collapsible = CollapsiblePrimitive.Root

const collapsibleItemVariants = cva(
  "transition-all duration-700 ease-silk overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-border/50 rounded-2xl bg-card",
        glass: "glass-card rounded-2xl border border-white/20",
        elevated: "bg-card rounded-2xl shadow-soft hover:shadow-medium border",
        minimal: "border-b border-border/30 bg-transparent",
        premium: "bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border border-primary/20"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const CollapsibleItem = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentProps<typeof CollapsiblePrimitive.Root> &
  VariantProps<typeof collapsibleItemVariants> & {
    glow?: boolean
    animated?: boolean
  }
>(({ className, variant, size, glow = false, animated = true, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    className={cn(
      collapsibleItemVariants({ variant, size }),
      glow && "shadow-glow hover:shadow-glow-lg",
      animated && "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "group",
      className
    )}
    {...props}
  />
))
CollapsibleItem.displayName = "CollapsibleItem"

const collapsibleTriggerVariants = cva(
  "flex flex-1 items-center justify-between w-full text-left transition-all duration-500 ease-magnetic",
  "font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:rounded-xl",
  "hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "p-6 hover:bg-accent/50 data-[state=open]:bg-accent",
        glass: "p-6 hover:bg-white/5 data-[state=open]:bg-white/10",
        elevated: "p-6 hover:bg-accent/50 data-[state=open]:bg-accent",
        minimal: "p-4 hover:text-primary data-[state=open]:text-primary",
        premium: "p-6 hover:bg-primary/10 data-[state=open]:bg-primary/15 data-[state=open]:text-primary"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> &
  VariantProps<typeof collapsibleTriggerVariants> & {
    icon?: "chevron" | "plus" | "arrow" | "sparkle" | "zap" | "custom"
    customIcon?: React.ReactNode
    showIndicator?: boolean
    indicatorPosition?: "left" | "right"
    withIcon?: boolean
    triggerIcon?: React.ReactNode
  }
>(({ 
  className, 
  variant, 
  size, 
  icon = "chevron",
  customIcon,
  showIndicator = true,
  indicatorPosition = "right",
  withIcon = false,
  triggerIcon,
  children, 
  ...props 
}, ref) => {
  const iconComponents = {
    chevron: ChevronDown,
    plus: Plus,
    arrow: ArrowDown,
    sparkle: Sparkles,
    zap: Zap
  }

  const IconComponent = iconComponents[icon]

  const triggerContent = (
    <>
      {/* Left side content */}
      <div className="flex items-center gap-3 flex-1">
        {withIcon && triggerIcon && (
          <div className={cn(
            "flex items-center justify-center p-2 rounded-xl transition-all duration-500 ease-magnetic",
            "group-hover:scale-110 group-data-[state=open]:scale-110",
            variant === "premium" 
              ? "bg-primary/20 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            {triggerIcon}
          </div>
        )}
        
        {showIndicator && indicatorPosition === "left" && (
          <div className="flex items-center transition-transform duration-500 group-data-[state=open]:rotate-90">
            {customIcon || <ChevronRight className="h-4 w-4" />}
          </div>
        )}

        <span className="flex-1 transition-all duration-300 group-hover:translate-x-1">
          {children}
        </span>
      </div>

      {/* Right side indicator */}
      {showIndicator && indicatorPosition === "right" && (
        <div className={cn(
          "flex items-center transition-all duration-500 ease-magnetic",
          "group-data-[state=open]:rotate-180",
          icon === "plus" && "group-data-[state=open]:hidden",
          icon === "sparkle" && "group-data-[state=open]:text-primary group-hover:scale-110",
          icon === "zap" && "group-data-[state=open]:text-yellow-500"
        )}>
          {customIcon ? (
            customIcon
          ) : icon === "plus" ? (
            <>
              <Plus className="h-4 w-4 block group-data-[state=open]:hidden" />
              <Minus className="h-4 w-4 hidden group-data-[state=open]:block" />
            </>
          ) : icon === "arrow" ? (
            <>
              <ArrowDown className="h-4 w-4 block group-data-[state=open]:hidden" />
              <ArrowUp className="h-4 w-4 hidden group-data-[state=open]:block" />
            </>
          ) : (
            <IconComponent className="h-4 w-4" />
          )}
        </div>
      )}
    </>
  )

  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      ref={ref}
      className={cn(collapsibleTriggerVariants({ variant, size }), className)}
      {...props}
    >
      {triggerContent}
    </CollapsiblePrimitive.CollapsibleTrigger>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const collapsibleContentVariants = cva(
  "overflow-hidden transition-all duration-700 ease-silk",
  "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
  {
    variants: {
      variant: {
        default: "px-6",
        glass: "px-6",
        elevated: "px-6",
        minimal: "px-4",
        premium: "px-6"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> &
  VariantProps<typeof collapsibleContentVariants> & {
    animated?: boolean
    gradient?: boolean
    withBorder?: boolean
  }
>(({ className, variant, size, animated = true, gradient = false, withBorder = true, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      collapsibleContentVariants({ variant, size }),
      animated && "data-[state=open]:animate-in data-[state=closed]:animate-out",
      gradient && "bg-gradient-to-b from-transparent to-muted/20",
      className
    )}
    {...props}
  >
    <div className={cn(
      "transition-all duration-500 ease-silk",
      variant === "default" && "pb-6 pt-2",
      variant === "glass" && "pb-6 pt-2",
      variant === "elevated" && "pb-6 pt-2",
      variant === "minimal" && "pb-4 pt-2",
      variant === "premium" && "pb-6 pt-2",
      withBorder && "border-l-2 border-transparent group-data-[state=open]:border-primary/30 ml-3 pl-3"
    )}>
      {children}
    </div>
  </CollapsiblePrimitive.CollapsibleContent>
))
CollapsibleContent.displayName = "CollapsibleContent"

// Enhanced Collapsible with multiple items
interface EnhancedCollapsibleProps {
  items: Array<{
    id: string
    trigger: React.ReactNode
    content: React.ReactNode
    icon?: React.ReactNode
    variant?: VariantProps<typeof collapsibleItemVariants>["variant"]
    defaultOpen?: boolean
  }>
  type?: "single" | "multiple"
  variant?: VariantProps<typeof collapsibleItemVariants>["variant"]
  size?: VariantProps<typeof collapsibleItemVariants>["size"]
  className?: string
}

const EnhancedCollapsible: React.FC<EnhancedCollapsibleProps> = ({
  items,
  type = "single",
  variant = "default",
  size = "md",
  className
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(
    items.filter(item => item.defaultOpen).map(item => item.id)
  )

  return (
    <Collapsible 
      type={type} 
      className={cn("space-y-3", className)}
      value={type === "single" ? openItems[0] : undefined}
      onValueChange={type === "single" ? (value) => setOpenItems(value ? [value] : []) : setOpenItems}
    >
      {items.map((item) => (
        <CollapsibleItem
          key={item.id}
          value={item.id}
          variant={item.variant || variant}
          size={size}
          className="animate-in fade-in slide-in-from-top-4"
        >
          <CollapsibleTrigger
            variant={item.variant || variant}
            size={size}
            customIcon={item.icon}
            indicatorPosition={item.icon ? "left" : "right"}
            withIcon={!!item.icon}
            triggerIcon={item.icon}
          >
            {item.trigger}
          </CollapsibleTrigger>
          <CollapsibleContent variant={item.variant || variant} size={size}>
            {item.content}
          </CollapsibleContent>
        </CollapsibleItem>
      ))}
    </Collapsible>
  )
}

// Animated Collapsible with staggered animations
const AnimatedCollapsible = React.forwardRef<
  React.ElementRef<typeof Collapsible>,
  React.ComponentProps<typeof Collapsible> & {
    staggerDelay?: number
  }
>(({ children, staggerDelay = 100, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children)
  
  return (
    <Collapsible ref={ref} {...props}>
      {childrenArray.map((child, index) =>
        React.isValidElement(child) 
          ? React.cloneElement(child, {
              // @ts-ignore
              style: {
                animationDelay: `${index * staggerDelay}ms`
              }
            })
          : child
      )}
    </Collapsible>
  )
})
AnimatedCollapsible.displayName = "AnimatedCollapsible"

// Premium Collapsible with special effects
const PremiumCollapsible: React.FC<EnhancedCollapsibleProps> = (props) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl blur-xl opacity-50" />
      <EnhancedCollapsible
        {...props}
        variant="premium"
        className="relative z-10"
      />
    </div>
  )
}

// Collapsible with auto-close others (single mode)
const AutoCloseCollapsible: React.FC<EnhancedCollapsibleProps> = (props) => {
  return <EnhancedCollapsible {...props} type="single" />
}

// Export everything
export {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
  EnhancedCollapsible,
  AnimatedCollapsible,
  PremiumCollapsible,
  AutoCloseCollapsible,
  collapsibleItemVariants,
  collapsibleTriggerVariants,
  collapsibleContentVariants
}