import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base styles - محسنة للاستجابة والجمالية
  "inline-flex items-center justify-center rounded-full border font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm hover:shadow-md hover:from-primary/90 hover:to-primary/80",
        secondary:
          "border-transparent bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-sm hover:shadow-md hover:from-secondary/90 hover:to-secondary/80",
        destructive:
          "border-transparent bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md hover:from-destructive/90 hover:to-destructive/80",
        success:
          "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:shadow-md hover:from-green-600 hover:to-green-500",
        warning:
          "border-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm hover:shadow-md hover:from-yellow-600 hover:to-yellow-500",
        info:
          "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md hover:from-blue-600 hover:to-blue-500",
        outline:
          "text-foreground bg-background/80 backdrop-blur-sm border-border hover:bg-background hover:shadow-sm",
        ghost:
          "border-transparent bg-transparent text-foreground/80 hover:text-foreground hover:bg-accent/50",
      },
      size: {
        xs: "px-2 py-0.5 text-[10px] min-h-[18px] min-w-[18px]",
        sm: "px-2.5 py-0.5 text-xs min-h-[20px] min-w-[20px]",
        md: "px-3 py-1 text-sm min-h-[24px] min-w-[24px]",
        lg: "px-3.5 py-1.5 text-base min-h-[28px] min-w-[28px]",
        xl: "px-4 py-2 text-lg min-h-[32px] min-w-[32px]",
      },
      rounded: {
        full: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      rounded: "full",
      shadow: "sm",
    },
  }
)

// أنواع إضافية للأيقونات
const badgeIconVariants = cva(
  "flex-shrink-0 transition-colors duration-200",
  {
    variants: {
      size: {
        xs: "h-2.5 w-2.5",
        sm: "h-3 w-3",
        md: "h-3.5 w-3.5",
        lg: "h-4 w-4",
        xl: "h-5 w-5",
      },
      position: {
        left: "mr-1.5",
        right: "ml-1.5",
      }
    },
    defaultVariants: {
      size: "sm",
      position: "left",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  pulse?: boolean
  animated?: boolean
  closeable?: boolean
  onClose?: () => void
}

function Badge({ 
  className, 
  variant, 
  size,
  rounded,
  shadow,
  leftIcon,
  rightIcon,
  pulse = false,
  animated = false,
  closeable = false,
  onClose,
  children,
  ...props 
}: BadgeProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  
  const handleClose = () => {
    if (closeable && onClose) {
      onClose()
    } else if (closeable) {
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        badgeVariants({ variant, size, rounded, shadow }),
        animated && "animate-pulse",
        pulse && "relative before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-current before:opacity-30",
        closeable && "pr-2",
        className
      )}
      {...props}
    >
      {/* Left Icon */}
      {leftIcon && (
        <span className={cn(badgeIconVariants({ size, position: "left" }))}>
          {leftIcon}
        </span>
      )}
      
      {/* Content */}
      <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
        {children}
      </span>
      
      {/* Right Icon */}
      {rightIcon && (
        <span className={cn(badgeIconVariants({ size, position: "right" }))}>
          {rightIcon}
        </span>
      )}
      
      {/* Close Button */}
      {closeable && (
        <button
          type="button"
          onClick={handleClose}
          className="ml-1.5 flex-shrink-0 rounded-full p-0.5 hover:bg-current/20 focus:outline-none focus:ring-1 focus:ring-current transition-colors duration-150"
          aria-label="إزالة البادج"
        >
          <svg 
            className={cn(badgeIconVariants({ size }))} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

// مكون Badge Group لتنظيم البادجات
interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "xs" | "sm" | "md" | "lg"
  wrap?: boolean
}

function BadgeGroup({ 
  className, 
  gap = "sm", 
  wrap = true,
  children, 
  ...props 
}: BadgeGroupProps) {
  const gapClasses = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  }

  return (
    <div 
      className={cn(
        "flex flex-wrap items-center",
        gapClasses[gap],
        wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge, badgeVariants, BadgeGroup }