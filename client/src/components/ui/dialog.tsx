"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// أنواع الأحجام والأنماط
type DialogSize = "sm" | "md" | "lg" | "xl" | "full" | "auto"
type DialogVariant = "default" | "elegant" | "minimal" | "sidebar" | "fullscreen"

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize
  variant?: DialogVariant
  hideClose?: boolean
  closeOnOverlayClick?: boolean
  loading?: boolean
  showNavigation?: boolean
  onNext?: () => void
  onPrev?: () => void
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ 
  className, 
  children, 
  size = "md",
  variant = "default",
  hideClose = false,
  closeOnOverlayClick = true,
  loading = false,
  showNavigation = false,
  onNext,
  onPrev,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[95vw] h-[95vh]",
    auto: "max-w-max",
  }

  const variantClasses = {
    default: "border bg-background shadow-2xl rounded-2xl",
    elegant: "border-0 bg-background/95 backdrop-blur-md shadow-2xl rounded-3xl",
    minimal: "border-0 bg-transparent shadow-none",
    sidebar: "fixed right-0 top-0 h-full translate-x-0 translate-y-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right max-w-md rounded-l-2xl rounded-r-none",
    fullscreen: "fixed inset-4 sm:inset-8 rounded-2xl max-w-none h-auto",
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick) {
      e.preventDefault()
      // سيتم إغلاق الـ Dialog تلقائياً من خلال Radix UI
    }
  }

  return (
    <DialogPortal>
      <DialogOverlay onClick={handleOverlayClick} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          // الأنماط الأساسية
          sizeClasses[size],
          variantClasses[variant],
          // تحسينات إضافية
          variant !== "minimal" && "border-border",
          className
        )}
        {...props}
      >
        {/* حالة التحميل */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">جاري التحميل...</p>
            </div>
          </div>
        )}

        {children}

        {/* أزرار التنقل */}
        {showNavigation && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
            <button
              onClick={onPrev}
              className="pointer-events-auto ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-lg border hover:bg-background transition-all hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
              disabled={!onPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onNext}
              className="pointer-events-auto mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-lg border hover:bg-background transition-all hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
              disabled={!onNext}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* زر الإغلاق */}
        {!hideClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border shadow-lg transition-all hover:scale-110 hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

// مكون Header محسن
const DialogHeader = ({
  className,
  withBorder = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { withBorder?: boolean }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left pb-4",
      withBorder && "border-b border-border",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

// مكون Footer محسن
const DialogFooter = ({
  className,
  withBorder = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { withBorder?: boolean }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 sm:space-x-reverse pt-4",
      withBorder && "border-t border-border",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

// مكون Title محسن
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
    withIcon?: React.ReactNode
  }
>(({ className, withIcon, children, ...props }, ref) => (
  <div className="flex items-center gap-3">
    {withIcon && (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        {withIcon}
      </div>
    )}
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-xl font-bold leading-none tracking-tight text-foreground flex-1",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  </div>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// مكون Description محسن
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// مكون Body جديد للمحتوى
const DialogBody = ({
  className,
  scrollable = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { scrollable?: boolean }) => (
  <div
    className={cn(
      "flex-1",
      scrollable && "max-h-[60vh] overflow-y-auto",
      className
    )}
    {...props}
  />
)
DialogBody.displayName = "DialogBody"

// مكون Section جديد للتجميع
const DialogSection = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("space-y-4 py-4 first:pt-0 last:pb-0", className)}
    {...props}
  />
)
DialogSection.displayName = "DialogSection"

// مكون جديد للعرض على شكل Steps
interface DialogStepsProps {
  steps: string[]
  currentStep: number
  className?: string
}

const DialogSteps: React.FC<DialogStepsProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center space-y-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                index <= currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 bg-background text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                index <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 mx-2 transition-colors",
                index < currentStep ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// مكون جديد للعرض على شكل Sidebar
const DialogSidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right"
    width?: "sm" | "md" | "lg"
  }
>(({ className, side = "right", width = "md", ...props }, ref) => {
  const widthClasses = {
    sm: "max-w-xs",
    md: "max-w-sm",
    lg: "max-w-md",
  }

  return (
    <DialogContent
      ref={ref}
      variant="sidebar"
      size={width}
      className={cn(
        side === "left" && "left-0 right-auto translate-x-0",
        className
      )}
      {...props}
    />
  )
})
DialogSidebar.displayName = "DialogSidebar"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogSection,
  DialogSteps,
  DialogSidebar,
}