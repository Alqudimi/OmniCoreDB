"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, PanelLeft, PanelRight, PanelTop, PanelBottom } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

// أنواع الأحجام والأنماط
type SheetSize = "sm" | "md" | "lg" | "xl" | "full"
type SheetVariant = "default" | "elegant" | "minimal" | "blurred" | "bordered"

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-2xl transition-all ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 overflow-hidden",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right: "inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
      size: {
        sm: "w-3/4 sm:max-w-sm",
        md: "w-4/5 sm:max-w-md",
        lg: "w-5/6 sm:max-w-lg",
        xl: "w-11/12 sm:max-w-2xl",
        full: "w-full sm:max-w-full",
      },
      variant: {
        default: "bg-background border-border",
        elegant: "bg-background/95 backdrop-blur-md border-0 shadow-2xl",
        minimal: "bg-transparent border-0 shadow-none",
        blurred: "bg-background/80 backdrop-blur-lg border-border/50",
        bordered: "bg-background border-2 border-border shadow-xl",
      }
    },
    defaultVariants: {
      side: "right",
      size: "md",
      variant: "default",
    },
  }
)

// أيقونات الجوانب
const sideIcons = {
  top: PanelTop,
  bottom: PanelBottom,
  left: PanelLeft,
  right: PanelRight,
}

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideClose?: boolean
  closeOnOverlayClick?: boolean
  showHandle?: boolean
  overlayClassName?: string
  withIcon?: boolean
  lockScroll?: boolean
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ 
  side = "right", 
  size = "md",
  variant = "default",
  className, 
  children, 
  hideClose = false,
  closeOnOverlayClick = true,
  showHandle = false,
  overlayClassName,
  withIcon = false,
  lockScroll = true,
  ...props 
}, ref) => {
  const SideIcon = sideIcons[side!]

  React.useEffect(() => {
    if (lockScroll) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [lockScroll])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!closeOnOverlayClick) {
      e.preventDefault()
    }
  }

  const getClosePosition = () => {
    switch (side) {
      case "top": return "right-4 top-4"
      case "bottom": return "right-4 top-4"
      case "left": return "right-4 top-4"
      case "right": return "left-4 top-4"
      default: return "right-4 top-4"
    }
  }

  const getHandlePosition = () => {
    switch (side) {
      case "top": return "bottom-2 left-1/2 transform -translate-x-1/2"
      case "bottom": return "top-2 left-1/2 transform -translate-x-1/2"
      case "left": return "right-2 top-1/2 transform -translate-y-1/2"
      case "right": return "left-2 top-1/2 transform -translate-y-1/2"
      default: return ""
    }
  }

  return (
    <SheetPortal>
      <SheetOverlay 
        className={overlayClassName}
        onClick={handleOverlayClick}
      />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          sheetVariants({ side, size, variant }),
          // تحسينات إضافية بناءً على الجانب
          side === "top" && "rounded-b-2xl",
          side === "bottom" && "rounded-t-2xl",
          side === "left" && "rounded-r-2xl",
          side === "right" && "rounded-l-2xl",
          variant === "elegant" && "rounded-2xl m-2",
          variant === "minimal" && "rounded-none",
          className
        )}
        {...props}
      >
        {/* Handle للسحب (للهواتف) */}
        {showHandle && (
          <div className={cn(
            "absolute flex items-center justify-center",
            getHandlePosition()
          )}>
            <div className={cn(
              "bg-border rounded-full",
              side === "top" || side === "bottom" ? "w-12 h-1" : "w-1 h-12"
            )} />
          </div>
        )}

        {/* أيقونة الجانب */}
        {withIcon && SideIcon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 mb-4">
            <SideIcon className="h-4 w-4 text-primary" />
          </div>
        )}

        {children}

        {/* زر الإغلاق */}
        {!hideClose && (
          <SheetPrimitive.Close className={cn(
            "absolute rounded-sm opacity-70 ring-offset-background transition-all duration-200",
            "hover:opacity-100 hover:scale-110 hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none data-[state=open]:bg-secondary",
            "flex items-center justify-center w-8 h-8",
            getClosePosition()
          )}>
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
})
SheetContent.displayName = SheetPrimitive.Content.displayName

// مكون Header محسن
const SheetHeader = ({
  className,
  withBorder = false,
  withBack = false,
  onBack,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { 
  withBorder?: boolean
  withBack?: boolean
  onBack?: () => void
}) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left pb-4",
      withBorder && "border-b border-border",
      className
    )}
    {...props}
  >
    {withBack && onBack && (
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 self-start"
      >
        <ChevronLeft className="h-4 w-4" />
        رجوع
      </button>
    )}
    {props.children}
  </div>
)
SheetHeader.displayName = "SheetHeader"

// مكون Footer محسن
const SheetFooter = ({
  className,
  withBorder = false,
  sticky = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { 
  withBorder?: boolean
  sticky?: boolean
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 sm:space-x-reverse pt-4",
      withBorder && "border-t border-border",
      sticky && "sticky bottom-0 bg-background pb-6 -mx-6 px-6 pt-4 border-t border-border",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

// مكون Title محسن
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> & {
    withIcon?: React.ReactNode
    subtitle?: string
  }
>(({ className, withIcon, subtitle, children, ...props }, ref) => (
  <div className="space-y-1">
    <div className="flex items-center gap-3">
      {withIcon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          {withIcon}
        </div>
      )}
      <SheetPrimitive.Title
        ref={ref}
        className={cn(
          "text-xl font-bold leading-none tracking-tight text-foreground flex-1",
          className
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Title>
    </div>
    {subtitle && (
      <p className="text-sm text-muted-foreground leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

// مكون Description محسن
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

// مكون Body جديد للمحتوى
const SheetBody = ({
  className,
  scrollable = true,
  padded = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { 
  scrollable?: boolean
  padded?: boolean
}) => (
  <div
    className={cn(
      "flex-1",
      scrollable && "overflow-y-auto",
      !padded && "-mx-6 -my-6",
      className
    )}
    {...props}
  />
)
SheetBody.displayName = "SheetBody"

// مكون Section جديد للتجميع
const SheetSection = ({
  className,
  withBorder = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { 
  withBorder?: boolean
}) => (
  <div
    className={cn(
      "space-y-4 py-4 first:pt-0 last:pb-0",
      withBorder && "border-b border-border last:border-b-0",
      className
    )}
    {...props}
  />
)
SheetSection.displayName = "SheetSection"

// مكون Sheet متداخل
interface NestedSheetProps {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
  size?: SheetSize
}

const NestedSheet: React.FC<NestedSheetProps> = ({
  trigger,
  children,
  side = "right",
  size = "md",
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side={side} size={size}>
        {children}
      </SheetContent>
    </Sheet>
  )
}

// مكون Sheet Group لإدارة multiple sheets
const SheetGroupContext = React.createContext<{
  activeSheet: string | null
  setActiveSheet: (sheet: string | null) => void
}>({
  activeSheet: null,
  setActiveSheet: () => {},
})

const SheetGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSheet, setActiveSheet] = React.useState<string | null>(null)

  return (
    <SheetGroupContext.Provider value={{ activeSheet, setActiveSheet }}>
      {children}
    </SheetGroupContext.Provider>
  )
}

const useSheetGroup = () => {
  const context = React.useContext(SheetGroupContext)
  if (!context) {
    throw new Error("useSheetGroup must be used within a SheetGroup")
  }
  return context
}

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetSection,
  NestedSheet,
  SheetGroup,
  useSheetGroup,
}