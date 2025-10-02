import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2
} from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-2xl border p-6 transition-all duration-500 ease-silk",
  "group overflow-hidden backdrop-blur-lg",
  "[&>svg~*]:pl-9 [&>svg+div]:translate-y-[-2px]",
  "[&>svg]:absolute [&>svg]:left-6 [&>svg]:top-6",
  "[&>svg]:size-5 [&>svg]:shrink-0",
  "shadow-soft hover:shadow-medium",
  {
    variants: {
      variant: {
        default: cn(
          "bg-gradient-to-r from-background to-muted/30",
          "border-primary/20 text-foreground",
          "[&>svg]:text-primary",
          "hover:border-primary/30"
        ),
        destructive: cn(
          "bg-gradient-to-r from-destructive/5 to-destructive/10",
          "border-destructive/30 text-destructive",
          "[&>svg]:text-destructive",
          "hover:border-destructive/40",
          "dark:from-destructive/10 dark:to-destructive/15"
        ),
        success: cn(
          "bg-gradient-to-r from-success/5 to-success/10",
          "border-success/30 text-success",
          "[&>svg]:text-success",
          "hover:border-success/40",
          "dark:from-success/10 dark:to-success/15"
        ),
        warning: cn(
          "bg-gradient-to-r from-warning/5 to-warning/10",
          "border-warning/30 text-warning",
          "[&>svg]:text-warning",
          "hover:border-warning/40",
          "dark:from-warning/10 dark:to-warning/15"
        ),
        info: cn(
          "bg-gradient-to-r from-primary/5 to-primary/10",
          "border-primary/30 text-primary",
          "[&>svg]:text-primary",
          "hover:border-primary/40",
          "dark:from-primary/10 dark:to-primary/15"
        ),
        premium: cn(
          "glass-premium border-primary/40",
          "text-foreground [&>svg]:text-primary",
          "shadow-glow hover:shadow-glow-lg"
        ),
      },
      size: {
        sm: "p-4 [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
        md: "p-6 [&>svg]:left-6 [&>svg]:top-6 [&>svg~*]:pl-9",
        lg: "p-8 [&>svg]:left-8 [&>svg]:top-8 [&>svg~*]:pl-11",
      },
      elevation: {
        flat: "shadow-none hover:shadow-none",
        raised: "shadow-soft hover:shadow-medium",
        floating: "shadow-large hover:shadow-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      elevation: "raised",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof alertVariants> & {
    dismissible?: boolean
    onDismiss?: () => void
    icon?: React.ReactNode
    showIcon?: boolean
    loading?: boolean
  }
>(({ 
  className, 
  variant, 
  size,
  elevation,
  dismissible = false,
  onDismiss,
  icon,
  showIcon = true,
  loading = false,
  children,
  ...props 
}, ref) => {
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.()
    }, 300)
  }

  const defaultIcons = {
    default: <Info className="size-5" />,
    destructive: <AlertCircle className="size-5" />,
    success: <CheckCircle2 className="size-5" />,
    warning: <AlertTriangle className="size-5" />,
    info: <Info className="size-5" />,
    premium: <CheckCircle2 className="size-5" />,
  }

  if (!isVisible) return null

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        alertVariants({ variant, size, elevation }),
        "animate-in fade-in slide-in-from-top-4 duration-500",
        className
      )}
      {...props}
    >
      {/* Animated Background Effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        variant === "premium" && "bg-gradient-to-r from-primary/5 to-transparent"
      )} />
      
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute right-6 top-6">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )}

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            "absolute right-4 top-4 p-1 rounded-lg transition-all duration-300 ease-magnetic",
            "opacity-0 group-hover:opacity-100",
            "hover:bg-muted/50 hover:scale-110",
            "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        >
          <X className="size-3" />
        </button>
      )}

      {/* Custom Icon or Default Icon */}
      {showIcon && !loading && (icon || defaultIcons[variant || "default"])}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Progress Bar for Auto-dismiss */}
      {dismissible && (
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-current opacity-20 group-hover:w-full transition-all duration-3000 ease-linear" />
      )}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
>(({ className, as: Comp = "h5", ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "mb-2 font-semibold leading-6 tracking-tight",
      "text-lg md:text-xl",
      "flex items-center gap-2",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm md:text-base leading-relaxed opacity-90",
      "transition-opacity duration-300 group-hover:opacity-100",
      "[&_p]:mb-2 [&_p]:last:mb-0",
      "[&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:opacity-80",
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// Enhanced Alert Actions Component
const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "end" | "center"
  }
>(({ className, align = "end", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex gap-3 mt-4",
      align === "start" && "justify-start",
      align === "end" && "justify-end",
      align === "center" && "justify-center",
      "flex-wrap",
      className
    )}
    {...props}
  />
))
AlertActions.displayName = "AlertActions"

// Toast-style Alert for temporary notifications
const ToastAlert = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Alert> & {
    duration?: number
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  }
>(({ 
  duration = 5000,
  position = "top-right",
  onDismiss,
  className,
  ...props 
}, ref) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onDismiss])

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  }

  return (
    <div className={cn(
      "fixed z-toast max-w-sm animate-in fade-in-90 slide-in-from-top-full",
      positionClasses[position],
      className
    )}>
      <Alert
        ref={ref}
        dismissible
        onDismiss={onDismiss}
        size="sm"
        elevation="floating"
        {...props}
      />
    </div>
  )
})
ToastAlert.displayName = "ToastAlert"

// Alert Group for multiple alerts
const AlertGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gap?: "sm" | "md" | "lg"
    maxAlerts?: number
  }
>(({ className, gap = "md", maxAlerts, children, ...props }, ref) => {
  const gapClasses = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
  }

  const alerts = React.Children.toArray(children)
  const displayedAlerts = maxAlerts ? alerts.slice(0, maxAlerts) : alerts

  return (
    <div
      ref={ref}
      className={cn(gapClasses[gap], "w-full", className)}
      {...props}
    >
      {displayedAlerts.map((alert, index) => (
        <div
          key={index}
          className="animate-in fade-in slide-in-from-left-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {alert}
        </div>
      ))}
    </div>
  )
})
AlertGroup.displayName = "AlertGroup"

export { 
  Alert, 
  AlertTitle, 
  AlertDescription, 
  AlertActions,
  ToastAlert,
  AlertGroup,
  alertVariants 
}