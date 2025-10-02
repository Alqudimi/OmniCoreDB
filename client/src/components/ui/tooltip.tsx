"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Info, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  Star,
  LucideIcon
} from "lucide-react"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipContentVariants = cva(
  "z-50 overflow-hidden rounded-xl shadow-lg animate-in origin-[--radix-tooltip-content-transform-origin]",
  {
    variants: {
      variant: {
        default: [
          "border border-border/50 bg-popover text-popover-foreground",
          "backdrop-blur-md supports-[backdrop-filter]:bg-popover/80"
        ],
        primary: [
          "border border-primary/20 bg-primary text-primary-foreground",
          "shadow-primary/25 backdrop-blur-md"
        ],
        success: [
          "border border-green-500/20 bg-green-500 text-white",
          "shadow-green-500/25 backdrop-blur-md"
        ],
        warning: [
          "border border-yellow-500/20 bg-yellow-500 text-white",
          "shadow-yellow-500/25 backdrop-blur-md"
        ],
        destructive: [
          "border border-red-500/20 bg-red-500 text-white",
          "shadow-red-500/25 backdrop-blur-md"
        ],
        glass: [
          "border border-white/20 bg-white/10 text-white",
          "backdrop-blur-xl shadow-black/20",
          "supports-[backdrop-filter]:bg-white/5"
        ],
        dark: [
          "border border-gray-800 bg-gray-900 text-white",
          "shadow-black/50 backdrop-blur-md"
        ]
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
        xl: "px-5 py-3 text-lg"
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shadow: "md"
    }
  }
)

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipContentVariants> & {
      icon?: LucideIcon
      showArrow?: boolean
      arrowClassName?: string
    }
>(({ 
  className, 
  sideOffset = 6, 
  variant,
  size,
  shadow,
  icon: Icon,
  showArrow = true,
  arrowClassName,
  children,
  ...props 
}, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      tooltipContentVariants({ variant, size, shadow }),
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
      "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
      "transition-all duration-200",
      className
    )}
    {...props}
  >
    <div className={cn(
      "flex items-center gap-2",
      {
        "flex-row-reverse": props.side === "left",
      }
    )}>
      {Icon && (
        <Icon className={cn(
          "h-3.5 w-3.5 flex-shrink-0",
          {
            "h-3 w-3": size === "sm",
            "h-4 w-4": size === "lg" || size === "xl",
          }
        )} />
      )}
      <div className="flex-1">{children}</div>
    </div>
    
    {showArrow && (
      <TooltipPrimitive.Arrow 
        className={cn(
          "fill-current drop-shadow-sm",
          {
            "text-popover": variant === "default",
            "text-primary": variant === "primary",
            "text-green-500": variant === "success",
            "text-yellow-500": variant === "warning",
            "text-red-500": variant === "destructive",
            "text-white/10": variant === "glass",
            "text-gray-900": variant === "dark",
          },
          arrowClassName
        )} 
        width={12} 
        height={6} 
      />
    )}
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Enhanced Tooltip with rich content
interface RichTooltipProps {
  trigger: React.ReactNode
  title?: string
  description: string
  variant?: VariantProps<typeof tooltipContentVariants>["variant"]
  size?: VariantProps<typeof tooltipContentVariants>["size"]
  icon?: LucideIcon
  side?: "top" | "right" | "bottom" | "left"
  delayDuration?: number
  className?: string
}

const RichTooltip: React.FC<RichTooltipProps> = ({
  trigger,
  title,
  description,
  variant = "default",
  size = "default",
  icon,
  side = "top",
  delayDuration = 300,
  className
}) => {
  const getDefaultIcon = () => {
    const icons = {
      default: Info,
      primary: Info,
      success: CheckCircle,
      warning: AlertCircle,
      destructive: AlertCircle,
      glass: Star,
      dark: HelpCircle
    }
    return icons[variant] || Info
  }

  const TooltipIcon = icon || getDefaultIcon()

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {trigger}
        </TooltipTrigger>
        <TooltipContent 
          variant={variant} 
          size={size} 
          side={side}
          icon={TooltipIcon}
          className={cn("max-w-xs", className)}
        >
          <div className="text-left">
            {title && (
              <div className={cn(
                "font-semibold mb-1",
                {
                  "text-sm": size === "sm" || size === "default",
                  "text-base": size === "lg",
                  "text-lg": size === "xl"
                }
              )}>
                {title}
              </div>
            )}
            <div className={cn(
              "leading-relaxed",
              {
                "text-xs": size === "sm",
                "text-sm": size === "default",
                "text-base": size === "lg" || size === "xl"
              }
            )}>
              {description}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Multi-line Tooltip Component
const MultiLineTooltip: React.FC<RichTooltipProps & {
  items?: string[]
  footer?: string
}> = ({
  trigger,
  title,
  description,
  items,
  footer,
  variant = "default",
  size = "lg",
  ...props
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {trigger}
        </TooltipTrigger>
        <TooltipContent 
          variant={variant} 
          size={size}
          className="max-w-sm p-4"
          {...props}
        >
          <div className="space-y-3">
            {(title || description) && (
              <div>
                {title && (
                  <h4 className="font-semibold text-base mb-1">{title}</h4>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            )}
            
            {items && items.length > 0 && (
              <ul className="space-y-1.5">
                {items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            
            {footer && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">{footer}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Interactive Tooltip with custom trigger
const InteractiveTooltip: React.FC<RichTooltipProps & {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}> = ({
  trigger,
  isOpen,
  onOpenChange,
  ...props
}) => {
  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>
          {trigger}
        </TooltipTrigger>
        <TooltipContent {...props} />
      </Tooltip>
    </TooltipProvider>
  )
}

// Tooltip Group for multiple tooltips
const TooltipGroup: React.FC<{
  children: React.ReactNode
  delayDuration?: number
  skipDelayDuration?: number
}> = ({ 
  children, 
  delayDuration = 300,
  skipDelayDuration = 300 
}) => {
  return (
    <TooltipProvider 
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      {children}
    </TooltipProvider>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  RichTooltip,
  MultiLineTooltip,
  InteractiveTooltip,
  TooltipGroup,
  tooltipContentVariants
}