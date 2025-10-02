import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const scrollAreaVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-background",
        glass: "bg-background/80 backdrop-blur-md border border-border/50",
        minimal: "bg-transparent",
        bordered: "border border-border rounded-lg bg-background",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        inner: "shadow-inner",
      }
    },
    defaultVariants: {
      variant: "default",
      shadow: "none",
    },
  }
)

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> &
    VariantProps<typeof scrollAreaVariants> & {
      hideScrollbar?: boolean
      scrollHideDelay?: number
    }
>(({ className, variant, shadow, hideScrollbar = false, scrollHideDelay, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(scrollAreaVariants({ variant, shadow }), className)}
    scrollHideDelay={scrollHideDelay}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport 
      className={cn(
        "h-full w-full rounded-[inherit] transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    {!hideScrollbar && (
      <>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </>
    )}
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const scrollbarVariants = cva(
  "flex touch-none select-none transition-all duration-500",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        blended: "bg-background/20 backdrop-blur-sm",
        minimal: "opacity-0 hover:opacity-100",
      },
      size: {
        sm: "w-2",
        md: "w-2.5",
        lg: "w-3",
        xl: "w-4",
      },
      orientation: {
        vertical: "h-full border-l border-l-transparent p-[1px]",
        horizontal: "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> &
    VariantProps<typeof scrollbarVariants> & {
      thumbVariant?: "default" | "gradient" | "glow"
    }
>(({ className, orientation = "vertical", variant, size, thumbVariant = "default", ...props }, ref) => {
  const thumbStyles = cva(
    "relative flex-1 rounded-full transition-all duration-300",
    {
      variants: {
        thumbVariant: {
          default: "bg-border hover:bg-border/80",
          gradient: "bg-gradient-to-b from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60",
          glow: [
            "bg-primary shadow-lg shadow-primary/25",
            "hover:shadow-xl hover:shadow-primary/35",
            "hover:scale-105 transform origin-center"
          ],
        },
        orientation: {
          vertical: "min-h-[40px]",
          horizontal: "min-w-[40px]",
        }
      },
      defaultVariants: {
        thumbVariant: "default",
      },
    }
  )

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        scrollbarVariants({ variant, size, orientation }),
        "group",
        "hover:bg-border/10",
        "data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb 
        className={cn(
          thumbStyles({ thumbVariant, orientation }),
          "group-hover:scale-105"
        )} 
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// Enhanced Scroll Area with Auto Hide
const AutoScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    autoHide?: boolean
    showScrollIndicator?: boolean
  }
>(({ className, autoHide = true, showScrollIndicator = false, children, ...props }, ref) => {
  const [isAtTop, setIsAtTop] = React.useState(true)
  const [isAtBottom, setIsAtBottom] = React.useState(false)
  const viewportRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    setIsAtTop(scrollTop === 0)
    setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 1)
  }

  return (
    <div className="relative">
      {/* Top Gradient Indicator */}
      {showScrollIndicator && !isAtTop && (
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background/80 to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Bottom Gradient Indicator */}
      {showScrollIndicator && !isAtBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
      )}

      <ScrollArea
        ref={ref}
        className={className}
        scrollHideDelay={autoHide ? 600 : undefined}
        onScroll={handleScroll}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport 
          ref={viewportRef}
          className="h-full w-full rounded-[inherit]"
          onScroll={handleScroll}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
      </ScrollArea>
    </div>
  )
})
AutoScrollArea.displayName = "AutoScrollArea"

// Scroll To Top/Bottom Buttons
const ScrollToTopButton: React.FC<{
  onClick: () => void
  className?: string
}> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "absolute bottom-4 right-4 z-20 p-2 rounded-full bg-background border shadow-lg",
      "hover:bg-accent hover:scale-110 active:scale-95 transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  </button>
)

const ScrollToBottomButton: React.FC<{
  onClick: () => void
  className?: string
}> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "absolute bottom-4 right-4 z-20 p-2 rounded-full bg-background border shadow-lg",
      "hover:bg-accent hover:scale-110 active:scale-95 transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
)

// Enhanced Scroll Area with Controls
const ControlledScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    showControls?: boolean
    className?: string
  }
>(({ className, showControls = false, children, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    viewportRef.current?.scrollTo({ 
      top: viewportRef.current.scrollHeight, 
      behavior: 'smooth' 
    })
  }

  return (
    <div className="relative">
      <AutoScrollArea
        ref={ref}
        className={className}
        showScrollIndicator={showControls}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport ref={viewportRef}>
          {children}
        </ScrollAreaPrimitive.Viewport>
      </AutoScrollArea>

      {showControls && (
        <>
          <ScrollToTopButton onClick={scrollToTop} />
          <ScrollToBottomButton onClick={scrollToBottom} />
        </>
      )}
    </div>
  )
})
ControlledScrollArea.displayName = "ControlledScrollArea"

// Scroll Area with Custom Scrollbar
const CustomScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    scrollbarProps?: React.ComponentPropsWithoutRef<typeof ScrollBar>
  }
>(({ className, scrollbarProps, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar {...scrollbarProps} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
CustomScrollArea.displayName = "CustomScrollArea"

export { 
  ScrollArea, 
  ScrollBar, 
  AutoScrollArea, 
  ControlledScrollArea, 
  CustomScrollArea,
  ScrollToTopButton,
  ScrollToBottomButton 
}