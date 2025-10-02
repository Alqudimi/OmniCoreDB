import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Loader2,
  Bell,
  Check,
  Sparkles
} from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

// أنواع المواضع
type ToastPosition = 
  | "top-left" 
  | "top-center" 
  | "top-right" 
  | "bottom-left" 
  | "bottom-center" 
  | "bottom-right"

interface ToastViewportProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {
  position?: ToastPosition
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, position = "top-right", ...props }, ref) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-center": "top-0 left-1/2 transform -translate-x-1/2",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-center": "bottom-0 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-0 right-0",
  }

  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]",
        positionClasses[position],
        position.includes("bottom") && "sm:flex-col-reverse",
        className
      )}
      {...props}
    />
  )
})
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// أنماط Toast المحسنة
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-2xl transition-all duration-300 backdrop-blur-sm",
  "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
  "data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
  "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-border bg-background/95 text-foreground",
        success: "border-success/20 bg-success/10 text-success-foreground",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive-foreground",
        warning: "border-warning/20 bg-warning/10 text-warning-foreground",
        info: "border-info/20 bg-info/10 text-info-foreground",
        loading: "border-primary/20 bg-primary/10 text-primary-foreground",
        premium: "border-gradient bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-foreground border-purple-200/20",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// أيقونات الأنماط
const variantIcons = {
  default: Bell,
  success: CheckCircle2,
  destructive: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
  premium: Sparkles,
}

interface ToastProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  icon?: React.ReactNode
  showIcon?: boolean
  progress?: number
  autoClose?: number
  onClose?: () => void
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ 
  className, 
  variant, 
  size,
  icon,
  showIcon = true,
  progress,
  autoClose,
  onClose,
  children,
  ...props 
}, ref) => {
  const [currentProgress, setCurrentProgress] = React.useState(100)
  const IconComponent = variant ? variantIcons[variant] : Bell

  React.useEffect(() => {
    if (autoClose && progress === undefined) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => Math.max(0, prev - (100 / (autoClose / 50))))
      }, 50)

      return () => clearInterval(interval)
    }
  }, [autoClose, progress])

  const displayProgress = progress !== undefined ? progress : currentProgress

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), className)}
      {...props}
    >
      {/* شريط التقدم */}
      {(autoClose || progress !== undefined) && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-current/20">
          <div 
            className="h-full bg-current/50 transition-all duration-50 ease-linear"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      )}

      {/* الأيقونة */}
      {showIcon && (
        <div className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "success" && "bg-success/20 text-success",
          variant === "destructive" && "bg-destructive/20 text-destructive",
          variant === "warning" && "bg-warning/20 text-warning",
          variant === "info" && "bg-info/20 text-info",
          variant === "loading" && "bg-primary/20 text-primary",
          variant === "premium" && "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        )}>
          {icon || (
            <IconComponent className={cn(
              "h-3.5 w-3.5",
              variant === "loading" && "animate-spin"
            )} />
          )}
        </div>
      )}

      {/* المحتوى */}
      <div className="flex-1 space-y-1 min-w-0">
        {children}
      </div>

      {/* زر الإغلاق */}
      <ToastClose 
        onClose={onClose}
        className={cn(
          "opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110",
          variant === "premium" && "text-purple-600 hover:text-purple-700"
        )}
      />
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
    variant?: "default" | "outline" | "ghost"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  }

  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> & {
    onClose?: () => void
  }
>(({ className, onClose, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-all duration-200 group-hover:opacity-70 hover:opacity-100 hover:bg-accent focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
      className
    )}
    toast-close=""
    onClick={onClose}
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
>(({ className, as: Comp = "h3", ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    asChild
    {...props}
  >
    <Comp className={cn("text-sm font-semibold leading-none tracking-tight", className)} />
  </ToastPrimitives.Title>
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed break-words", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// مكون Toast Container محسن
interface ToastContainerProps {
  position?: ToastPosition
  limit?: number
  children?: React.ReactNode
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
  limit = 3,
  children,
}) => {
  return (
    <ToastProvider swipeDirection="right" duration={5000}>
      {children}
      <ToastViewport position={position} />
    </ToastProvider>
  )
}

// مكون Toast مخصص للاستخدام السهل
interface CustomToastProps {
  title?: string
  description?: string
  variant?: VariantProps<typeof toastVariants>["variant"]
  action?: React.ReactNode
  icon?: React.ReactNode
  duration?: number
  progress?: number
}

const CustomToast: React.FC<CustomToastProps> = ({
  title,
  description,
  variant = "default",
  action,
  icon,
  duration,
  progress,
}) => {
  return (
    <Toast variant={variant} autoClose={duration} progress={progress} icon={icon}>
      <div className="grid gap-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && (
          <ToastDescription>{description}</ToastDescription>
        )}
      </div>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </Toast>
  )
}

// Hook لإدارة الـ Toasts
const useToast = () => {
  const [toasts, setToasts] = React.useState<CustomToastProps[]>([])

  const toast = (props: CustomToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...props, id }])
    
    // إزالة تلقائية بعد المدة
    if (props.duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, props.duration)
    }
  }

  const success = (title: string, description?: string) => 
    toast({ title, description, variant: "success" })

  const error = (title: string, description?: string) => 
    toast({ title, description, variant: "destructive" })

  const warning = (title: string, description?: string) => 
    toast({ title, description, variant: "warning" })

  const info = (title: string, description?: string) => 
    toast({ title, description, variant: "info" })

  const loading = (title: string, description?: string) => 
    toast({ title, description, variant: "loading" })

  const premium = (title: string, description?: string) => 
    toast({ title, description, variant: "premium" })

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    premium,
    toasts,
  }
}

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastContainer,
  CustomToast,
  useToast,
}