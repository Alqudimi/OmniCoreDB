"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { X, Grab } from "lucide-react"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "animate-in fade-in-0 duration-300",
      "backdrop-blur-sm supports-[backdrop-filter]:bg-black/60",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    showCloseButton?: boolean
    showHandle?: boolean
    side?: "top" | "bottom" | "left" | "right"
    size?: "sm" | "md" | "lg" | "xl" | "full"
  }
>(({ 
  className, 
  children, 
  showCloseButton = true,
  showHandle = true,
  side = "bottom",
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg", 
    xl: "max-w-xl",
    full: "max-w-full"
  }

  const sideStyles = {
    top: cn(
      "inset-x-0 top-0 rounded-b-3xl border-b",
      "animate-in slide-in-from-top duration-400",
      sizes[size]
    ),
    bottom: cn(
      "inset-x-0 bottom-0 rounded-t-3xl border-t",
      "animate-in slide-in-from-bottom duration-400",
      sizes[size]
    ),
    left: cn(
      "inset-y-0 left-0 rounded-r-3xl border-r",
      "animate-in slide-in-from-left duration-400",
      sizes[size]
    ),
    right: cn(
      "inset-y-0 right-0 rounded-l-3xl border-l",
      "animate-in slide-in-from-right duration-400",
      sizes[size]
    )
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-background",
          "shadow-2xl shadow-black/20 border-border/50",
          "backdrop-blur-lg supports-[backdrop-filter]:bg-background/95",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {/* Handle */}
        {showHandle && (
          <div className={cn(
            "flex justify-center py-3",
            {
              "border-b": side === "left" || side === "right",
              "border-b-0": side === "top" || side === "bottom"
            }
          )}>
            <div className={cn(
              "rounded-full bg-muted/50 p-1 transition-all duration-300",
              "hover:bg-muted hover:scale-110",
              {
                "h-1.5 w-12": side === "top" || side === "bottom",
                "h-12 w-1.5": side === "left" || side === "right"
              }
            )}>
              <Grab className={cn(
                "text-muted-foreground/60",
                {
                  "w-3 h-3 rotate-90": side === "left" || side === "right",
                  "w-3 h-3": side === "top" || side === "bottom"
                }
              )} />
            </div>
          </div>
        )}

        {/* Close Button */}
        {showCloseButton && (
          <DrawerPrimitive.Close className={cn(
            "absolute z-50 rounded-full p-2 transition-all duration-300",
            "bg-background/80 backdrop-blur-sm border shadow-lg",
            "hover:bg-accent hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            {
              "right-4 top-4": side === "bottom" || side === "top",
              "top-4 right-4": side === "left" || side === "right",
            }
          )}>
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Close</span>
          </DrawerPrimitive.Close>
        )}

        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "grid gap-2.5 p-6 pb-2.5 text-center sm:text-left",
      "bg-gradient-to-b from-background to-transparent",
      "sticky top-0 z-10 backdrop-blur-sm",
      className
    )}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-auto flex flex-col gap-3 p-6 pt-4",
      "bg-gradient-to-t from-background to-transparent",
      "sticky bottom-0 z-10 backdrop-blur-sm",
      "border-t border-border/50",
      className
    )}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-bold leading-7 tracking-tight",
      "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground leading-6",
      "animate-in fade-in-50 duration-500 delay-150",
      className
    )}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

// New Section Component
const DrawerSection = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "px-6 py-4 border-b border-border/30 last:border-b-0",
      "transition-colors duration-200 hover:bg-accent/30",
      className
    )}
    {...props}
  />
)
DrawerSection.displayName = "DrawerSection"

// New Body Component with scroll effects
const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex-1 overflow-auto px-6 py-2",
      "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
      "hover:scrollbar-thumb-muted-foreground/30",
      className
    )}
    {...props}
  />
)
DrawerBody.displayName = "DrawerBody"

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerSection,
  DrawerBody,
}