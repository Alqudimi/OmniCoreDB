import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { X, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    variant?: "default" | "elegant" | "modern" | "minimal" | "glass"
    showClose?: boolean
    showArrow?: boolean
    shadow?: "sm" | "md" | "lg" | "xl" | "2xl"
    animate?: "scale" | "slide" | "fade" | "bounce"
  }
>(({ 
  className, 
  align = "center", 
  sideOffset = 8, 
  variant = "default",
  showClose = false,
  showArrow = true,
  shadow = "lg",
  animate = "scale",
  children,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const variantStyles = {
    default: cn(
      "bg-popover border border-border/50",
      "backdrop-blur-sm"
    ),
    elegant: cn(
      "bg-popover/95 backdrop-blur-xl border border-border/30",
      "shadow-2xl"
    ),
    modern: cn(
      "bg-popover border-2 border-primary/20",
      "backdrop-blur-md"
    ),
    minimal: cn(
      "bg-popover border border-border/40",
      "backdrop-blur-xs"
    ),
    glass: cn(
      "bg-popover/80 backdrop-blur-2xl border border-white/20",
      "shadow-2xl"
    )
  }

  const shadowStyles = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl"
  }

  const animationStyles = {
    scale: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    ),
    slide: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2",
      "data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2",
      "data-[state=closed]:slide-out-to-left-2 data-[state=open]:slide-in-from-left-2",
      "data-[state=closed]:slide-out-to-right-2 data-[state=open]:slide-in-from-right-2"
    ),
    fade: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:duration-200 data-[state=open]:duration-300"
    ),
    bounce: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-105 data-[state=open]:animate-bounce-in",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    )
  }

  const ArrowIcon = {
    top: ArrowUp,
    bottom: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight
  }

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 outline-none origin-[--radix-popover-content-transform-origin]",
          "transition-all duration-300 ease-out",
          "rounded-2xl p-6",
          variantStyles[variant],
          shadowStyles[shadow],
          animationStyles[animate],
          "border",
          className
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        {/* Close Button */}
        {showClose && (
          <PopoverPrimitive.Close 
            className={cn(
              "absolute right-3 top-3 rounded-lg p-1.5 transition-all duration-200",
              "hover:bg-accent hover:scale-110 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "opacity-70 hover:opacity-100",
              "group"
            )}
          >
            <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            <span className="sr-only">Close</span>
          </PopoverPrimitive.Close>
        )}

        {/* Content */}
        <div className="relative">
          {children}
        </div>

        {/* Arrow Indicator */}
        {showArrow && (
          <PopoverPrimitive.Arrow 
            className={cn(
              "fill-popover transition-all duration-300",
              variant === "glass" && "fill-popover/80",
              variant === "elegant" && "fill-popover/95"
            )} 
            width={12} 
            height={6} 
          />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// مكون Header مخصص للـ Popover
const PopoverHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withSeparator?: boolean
  }
>(({ className, withSeparator = true, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    <div {...props} />
    {withSeparator && (
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mt-3 -mx-6" />
    )}
  </div>
))
PopoverHeader.displayName = "PopoverHeader"

// مكون Footer مخصص للـ Popover
const PopoverFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withSeparator?: boolean
  }
>(({ className, withSeparator = true, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {withSeparator && (
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-3 -mx-6" />
    )}
    <div {...props} />
  </div>
))
PopoverFooter.displayName = "PopoverFooter"

// مكون Title مخصص
const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: "default" | "elegant"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "text-lg font-semibold leading-6",
    elegant: "text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
  }

  return (
    <h3
      ref={ref}
      className={cn(
        "font-semibold tracking-tight",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
PopoverTitle.displayName = "PopoverTitle"

// مكون Description مخصص
const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground leading-6",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
))
PopoverDescription.displayName = "PopoverDescription"

// مكون Section مخصص للتجميع
const PopoverSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    spacing?: "sm" | "md" | "lg"
  }
>(({ className, spacing = "md", ...props }, ref) => {
  const spacingStyles = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6"
  }

  return (
    <div
      ref={ref}
      className={cn(spacingStyles[spacing], className)}
      {...props}
    />
  )
})
PopoverSection.displayName = "PopoverSection"

// مكون Action مخصص للأزرار
const PopoverAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "primary" | "destructive" | "ghost"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: cn(
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      "border border-border"
    ),
    primary: cn(
      "bg-primary text-primary-foreground hover:bg-primary/90",
      "shadow-lg hover:shadow-xl"
    ),
    destructive: cn(
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      "shadow-lg hover:shadow-xl"
    ),
    ghost: cn(
      "hover:bg-accent hover:text-accent-foreground",
      "border border-transparent hover:border-border"
    )
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium",
        "transition-all duration-200 transform",
        "hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
PopoverAction.displayName = "PopoverAction"

// مكون Trigger محسن
const PopoverTriggerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost"
    icon?: React.ReactNode
  }
>(({ className, variant = "default", icon, children, ...props }, ref) => {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }

  return (
    <PopoverTrigger asChild>
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 justify-center rounded-xl px-4 py-2.5 text-sm font-medium",
          "transition-all duration-200 transform",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="flex items-center justify-center w-4 h-4">{icon}</span>}
        {children}
      </button>
    </PopoverTrigger>
  )
})
PopoverTriggerButton.displayName = "PopoverTriggerButton"

// أنماط CSS مخصصة للحركات
const PopoverStyles = () => (
  <style jsx global>{`
    @keyframes bounce-in {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes slide-in-from-top-with-bounce {
      0% {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
      }
      60% {
        opacity: 1;
        transform: translateY(5px) scale(1.02);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .animate-bounce-in {
      animation: bounce-in 0.6s ease-out;
    }

    .animate-slide-in-with-bounce {
      animation: slide-in-from-top-with-bounce 0.5s ease-out;
    }
  `}</style>
)

export { 
  Popover, 
  PopoverTrigger, 
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  PopoverTitle,
  PopoverDescription,
  PopoverSection,
  PopoverAction,
  PopoverTriggerButton,
  PopoverStyles
}