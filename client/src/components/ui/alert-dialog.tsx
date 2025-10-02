import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  X,
  Loader2,
  Shield,
  AlertCircle
} from "lucide-react"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 backdrop-blur-lg transition-all duration-500 ease-silk",
      "bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "supports-[backdrop-filter]:bg-black/40",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const alertDialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border shadow-2xl duration-500 ease-magnetic",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
  "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      variant: {
        default: "bg-background border-border/50",
        destructive: "bg-destructive/5 border-destructive/30",
        warning: "bg-warning/5 border-warning/30",
        success: "bg-success/5 border-success/30",
        premium: "glass-premium border-primary/40 shadow-glow-lg",
      },
      size: {
        sm: "p-4 rounded-xl",
        md: "p-6 rounded-2xl",
        lg: "p-8 rounded-3xl",
        xl: "p-10 rounded-3xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> &
  VariantProps<typeof alertDialogContentVariants> & {
    showIcon?: boolean
    icon?: React.ReactNode
    loading?: boolean
    hideClose?: boolean
  }
>(({ 
  className, 
  variant, 
  size,
  showIcon = false,
  icon,
  loading = false,
  hideClose = false,
  children,
  ...props 
}, ref) => {
  const defaultIcons = {
    default: <Info className="size-6" />,
    destructive: <AlertTriangle className="size-6" />,
    warning: <AlertCircle className="size-6" />,
    success: <CheckCircle2 className="size-6" />,
    premium: <Shield className="size-6" />,
  }

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(alertDialogContentVariants({ variant, size }), className)}
        {...props}
      >
        {/* Close Button */}
        {!hideClose && (
          <AlertDialogPrimitive.Cancel
            className={cn(
              "absolute right-4 top-4 p-2 rounded-xl transition-all duration-300 ease-magnetic",
              "opacity-70 hover:opacity-100 hover:bg-muted/50",
              "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50",
              "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
            )}
          >
            <X className="size-4" />
          </AlertDialogPrimitive.Cancel>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {/* Header Icon */}
        {showIcon && (
          <div className={cn(
            "flex justify-center mb-4",
            variant === "destructive" && "text-destructive",
            variant === "warning" && "text-warning",
            variant === "success" && "text-success",
            variant === "premium" && "text-primary",
          )}>
            <div className={cn(
              "p-3 rounded-2xl",
              variant === "destructive" && "bg-destructive/10",
              variant === "warning" && "bg-warning/10",
              variant === "success" && "bg-success/10",
              variant === "premium" && "bg-primary/10",
              variant === "default" && "bg-primary/10 text-primary"
            )}>
              {icon || defaultIcons[variant || "default"]}
            </div>
          </div>
        )}

        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-3 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  align = "end",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end" | "between"
}) => {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between"
  }

  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row gap-3",
        alignClasses[align],
        className
      )}
      {...props}
    />
  )
}
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-2xl font-bold tracking-tight text-center sm:text-left",
      "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-lg leading-relaxed opacity-80 text-center sm:text-left",
      "transition-opacity duration-300 hover:opacity-100",
      className
    )}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const alertDialogActionVariants = cva(
  "transition-all duration-300 ease-magnetic font-semibold",
  {
    variants: {
      variant: {
        default: buttonVariants(),
        destructive: cn(
          buttonVariants({ variant: "destructive" }),
          "shadow-lg shadow-destructive/25 hover:shadow-destructive/40"
        ),
        warning: cn(
          buttonVariants({ variant: "warning" }),
          "shadow-lg shadow-warning/25 hover:shadow-warning/40"
        ),
        success: cn(
          buttonVariants({ variant: "success" }),
          "shadow-lg shadow-success/25 hover:shadow-success/40"
        ),
        premium: cn(
          buttonVariants({ variant: "premium" }),
          "shadow-glow hover:shadow-glow-lg"
        ),
        ghost: cn(
          buttonVariants({ variant: "ghost" }),
          "hover:bg-accent hover:text-accent-foreground"
        )
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-6",
        lg: "h-11 px-8 text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> &
  VariantProps<typeof alertDialogActionVariants> & {
    loading?: boolean
  }
>(({ 
  className, 
  variant, 
  size,
  loading = false,
  children,
  ...props 
}, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(alertDialogActionVariants({ variant, size }), className)}
    disabled={loading}
    {...props}
  >
    {loading ? (
      <>
        <Loader2 className="size-4 animate-spin mr-2" />
        جاري المعالجة...
      </>
    ) : (
      children
    )}
  </AlertDialogPrimitive.Action>
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> &
  VariantProps<typeof alertDialogActionVariants>
>(({ 
  className, 
  variant = "ghost",
  size = "md",
  ...props 
}, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      alertDialogActionVariants({ variant, size }),
      "mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

// Enhanced Alert Dialog with confirmation flow
interface EnhancedAlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  variant?: VariantProps<typeof alertDialogContentVariants>["variant"]
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
  showIcon?: boolean
  icon?: React.ReactNode
  destructive?: boolean
}

const EnhancedAlertDialog: React.FC<EnhancedAlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  onConfirm,
  onCancel,
  loading = false,
  showIcon = true,
  icon,
  destructive = false
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        variant={destructive ? "destructive" : variant}
        showIcon={showIcon}
        icon={icon}
        loading={loading}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter align="end">
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Quick Action Dialog for common use cases
const QuickAlertDialog = {
  Delete: (props: Omit<EnhancedAlertDialogProps, "variant" | "destructive" | "showIcon">) => (
    <EnhancedAlertDialog
      variant="destructive"
      destructive
      showIcon
      confirmText="حذف"
      cancelText="إلغاء"
      {...props}
    />
  ),
  Success: (props: Omit<EnhancedAlertDialogProps, "variant" | "showIcon">) => (
    <EnhancedAlertDialog
      variant="success"
      showIcon
      confirmText="موافق"
      {...props}
    />
  ),
  Warning: (props: Omit<EnhancedAlertDialogProps, "variant" | "showIcon">) => (
    <EnhancedAlertDialog
      variant="warning"
      showIcon
      confirmText="متابعة"
      {...props}
    />
  ),
  Premium: (props: Omit<EnhancedAlertDialogProps, "variant" | "showIcon">) => (
    <EnhancedAlertDialog
      variant="premium"
      showIcon
      confirmText="متابعة"
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  EnhancedAlertDialog,
  QuickAlertDialog,
  alertDialogContentVariants,
  alertDialogActionVariants
}