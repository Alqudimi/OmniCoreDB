import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Bell, 
  Loader2,
  X
} from "lucide-react"

// Enhanced Toast Component with icons and variants
const ToastIcon = ({ type }: { type: string }) => {
  const icons = {
    default: <Bell className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    loading: <Loader2 className="h-4 w-4 animate-spin" />,
  }

  return icons[type as keyof typeof icons] || icons.default
}

const ToastVariantStyles = {
  default: "border-border bg-background text-foreground shadow-lg",
  success: "border-green-500/20 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100 shadow-lg shadow-green-500/10",
  error: "border-red-500/20 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100 shadow-lg shadow-red-500/10",
  warning: "border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-900 dark:text-yellow-100 shadow-lg shadow-yellow-500/10",
  info: "border-blue-500/20 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-lg shadow-blue-500/10",
  loading: "border-border bg-background text-foreground shadow-lg",
}

const ProgressBar = ({ duration, variant = "default" }: { duration: number; variant?: string }) => {
  const variantColors = {
    default: "bg-primary",
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    loading: "bg-primary",
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20 rounded-b-lg overflow-hidden">
      <div
        className={cn(
          "h-full transition-all duration-100 ease-linear rounded-b-lg",
          variantColors[variant as keyof typeof variantColors] || variantColors.default
        )}
        style={{
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

interface EnhancedToastProps extends React.ComponentProps<typeof Toast> {
  variant?: "default" | "success" | "error" | "warning" | "info" | "loading"
  showIcon?: boolean
  showProgress?: boolean
  action?: React.ReactNode
}

const EnhancedToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  EnhancedToastProps
>(({ 
  className, 
  variant = "default", 
  showIcon = true,
  showProgress = true,
  duration = 5000,
  action,
  children,
  ...props 
}, ref) => {
  return (
    <Toast
      ref={ref}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all duration-300",
        "data-[swipe=move]:transition-none data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-all",
        "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:animate-out",
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-80",
        "data-[state=closed]:slide-out-to-right-full",
        "backdrop-blur-sm supports-[backdrop-filter]:bg-background/80",
        ToastVariantStyles[variant],
        className
      )}
      duration={duration}
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={cn(
            "flex-shrink-0 mt-0.5 rounded-full p-1.5",
            {
              "text-primary": variant === "default",
              "text-green-500": variant === "success",
              "text-red-500": variant === "error",
              "text-yellow-500": variant === "warning",
              "text-blue-500": variant === "info",
              "text-primary": variant === "loading",
            }
          )}>
            <ToastIcon type={variant} />
          </div>
        )}
        
        <div className="flex-1 grid gap-1.5">
          {children}
        </div>

        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}

        <ToastClose className={cn(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity",
          "hover:text-foreground hover:bg-accent hover:scale-110",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
          "group-hover:opacity-100"
        )}>
          <X className="h-3 w-3" />
        </ToastClose>
      </div>

      {showProgress && duration && (
        <ProgressBar duration={duration} variant={variant} />
      )}
    </Toast>
  )
})
EnhancedToast.displayName = "EnhancedToast"

// Enhanced Toast Viewport with positioning options
const EnhancedToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastViewport>,
  React.ComponentPropsWithoutRef<typeof ToastViewport> & {
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
  }
>(({ className, position = "top-right", ...props }, ref) => {
  const positionStyles = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "top-center": "top-0 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-0 left-1/2 transform -translate-x-1/2",
  }

  return (
    <ToastViewport
      ref={ref}
      className={cn(
        "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col",
        "sm:max-w-[420px] gap-2",
        positionStyles[position],
        className
      )}
      {...props}
    />
  )
})
EnhancedToastViewport.displayName = "EnhancedToastViewport"

// Enhanced Toaster Component
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({ 
        id, 
        title, 
        description, 
        action, 
        variant = "default",
        showIcon = true,
        showProgress = true,
        duration = 5000,
        ...props 
      }) {
        return (
          <EnhancedToast
            key={id}
            variant={variant}
            showIcon={showIcon}
            showProgress={showProgress}
            duration={duration}
            action={action}
            {...props}
          >
            <div className="grid gap-1.5">
              {title && (
                <ToastTitle className="text-sm font-semibold leading-none tracking-tight">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm opacity-90 leading-relaxed">
                  {description}
                </ToastDescription>
              )}
            </div>
          </EnhancedToast>
        )
      })}
      <EnhancedToastViewport position="top-right" />
    </ToastProvider>
  )
}

// Multi-viewport Toaster for different positions
export function MultiPositionToaster() {
  const { toasts } = useToast()

  const positionGroups = {
    "top-left": toasts.filter(t => t.position === "top-left"),
    "top-right": toasts.filter(t => !t.position || t.position === "top-right"),
    "top-center": toasts.filter(t => t.position === "top-center"),
    "bottom-left": toasts.filter(t => t.position === "bottom-left"),
    "bottom-right": toasts.filter(t => t.position === "bottom-right"),
    "bottom-center": toasts.filter(t => t.position === "bottom-center"),
  }

  return (
    <ToastProvider swipeDirection="right">
      {Object.entries(positionGroups).map(([position, positionToasts]) => (
        <React.Fragment key={position}>
          {positionToasts.map(function ({ 
            id, 
            title, 
            description, 
            action, 
            variant = "default",
            showIcon = true,
            showProgress = true,
            duration = 5000,
            ...props 
          }) {
            return (
              <EnhancedToast
                key={id}
                variant={variant}
                showIcon={showIcon}
                showProgress={showProgress}
                duration={duration}
                action={action}
                {...props}
              >
                <div className="grid gap-1.5">
                  {title && (
                    <ToastTitle className="text-sm font-semibold leading-none tracking-tight">
                      {title}
                    </ToastTitle>
                  )}
                  {description && (
                    <ToastDescription className="text-sm opacity-90 leading-relaxed">
                      {description}
                    </ToastDescription>
                  )}
                </div>
              </EnhancedToast>
            )
          })}
          <EnhancedToastViewport position={position as any} />
        </React.Fragment>
      ))}
    </ToastProvider>
  )
}

// Compact Toaster for mobile
export function CompactToaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({ 
        id, 
        title, 
        description, 
        action, 
        variant = "default",
        ...props 
      }) {
        return (
          <EnhancedToast
            key={id}
            variant={variant}
            showIcon={true}
            showProgress={false}
            className="max-w-[300px] mx-auto"
            {...props}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                {title && (
                  <ToastTitle className="text-sm font-medium truncate">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-xs opacity-90 truncate">
                    {description}
                  </ToastDescription>
                )}
              </div>
              {action}
            </div>
          </EnhancedToast>
        )
      })}
      <EnhancedToastViewport position="top-center" />
    </ToastProvider>
  )
}

export {
  EnhancedToast as Toast,
  EnhancedToastViewport as ToastViewport,
}