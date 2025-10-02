import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown, ArrowRight, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    variant?: "default" | "glass" | "minimal"
    orientation?: "horizontal" | "vertical"
  }
>(({ className, children, variant = "default", orientation = "horizontal", ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-50 flex items-center justify-center",
      {
        "max-w-max flex-1": orientation === "horizontal",
        "flex-col": orientation === "vertical",
      },
      {
        "bg-background/80 backdrop-blur-md border-b": variant === "glass",
        "bg-transparent": variant === "minimal",
        "bg-background": variant === "default",
      },
      "transition-all duration-300",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> & {
    orientation?: "horizontal" | "vertical"
  }
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex list-none items-center justify-center",
      {
        "flex-1 space-x-1": orientation === "horizontal",
        "flex-col space-y-2 w-full": orientation === "vertical",
      },
      "transition-all duration-300",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-foreground/80 hover:text-foreground",
          "hover:bg-accent/50 border border-transparent",
          "data-[state=open]:bg-accent data-[state=open]:text-foreground",
          "data-[state=open]:border-accent/30 data-[state=open]:shadow-sm"
        ],
        primary: [
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/35",
          "data-[state=open]:bg-primary/80 data-[state=open]:scale-105",
          "border border-primary/30 backdrop-blur-sm"
        ],
        ghost: [
          "text-foreground/70 hover:text-foreground hover:bg-accent/30",
          "data-[state=open]:text-foreground data-[state=open]:bg-accent/50",
          "data-[state=open]:shadow-inner"
        ],
        glass: [
          "bg-white/10 text-foreground backdrop-blur-md border border-white/20",
          "hover:bg-white/20 hover:border-white/30 hover:shadow-lg",
          "data-[state=open]:bg-white/30 data-[state=open]:shadow-xl",
          "shadow-sm shadow-black/10"
        ]
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1",
        default: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
    showChevron?: boolean
    withIcon?: React.ReactNode
  }
>(({ className, children, showChevron = true, withIcon, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {withIcon && (
      <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
        {withIcon}
      </span>
    )}
    <span className="whitespace-nowrap">{children}</span>
    {showChevron && (
      <ChevronDown
        className="relative top-[1px] h-3 w-3 transition-all duration-300 group-data-[state=open]:rotate-180 group-hover:scale-110"
        aria-hidden="true"
      />
    )}
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> & {
    layout?: "default" | "grid" | "mega"
  }
>(({ className, layout = "default", ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
      "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
      "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
      "data-[motion^=from-]:zoom-in-95 data-[motion^=to-]:zoom-out-95",
      "md:absolute md:w-auto",
      {
        "md:w-[500px]": layout === "grid",
        "md:w-[800px]": layout === "mega",
      },
      "transition-all duration-300",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> & {
    variant?: "default" | "highlight" | "withIcon"
    isExternal?: boolean
  }
>(({ className, variant = "default", isExternal, children, ...props }, ref) => {
  const linkStyles = cva(
    "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300",
    {
      variants: {
        variant: {
          default: [
            "text-foreground/80 hover:text-foreground hover:bg-accent/50",
            "focus:bg-accent focus:text-accent-foreground",
            "border border-transparent hover:border-accent/30"
          ],
          highlight: [
            "bg-gradient-to-r from-primary/10 to-primary/5 text-foreground",
            "hover:from-primary/20 hover:to-primary/10 hover:shadow-md",
            "border border-primary/20 shadow-sm",
            "hover:scale-105 transform"
          ],
          withIcon: [
            "flex items-center gap-3 p-4",
            "hover:bg-accent hover:text-accent-foreground",
            "border border-transparent hover:border-accent/30",
            "hover:shadow-lg hover:scale-105"
          ]
        }
      },
      defaultVariants: {
        variant: "default",
      },
    }
  )

  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={cn(linkStyles({ variant }), className)}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          {children}
        </div>
        {isExternal && (
          <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground flex-shrink-0" />
        )}
        {variant === "withIcon" && (
          <ArrowRight className="h-3 w-3 ml-2 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
        )}
      </div>
    </NavigationMenuPrimitive.Link>
  )
})
NavigationMenuLink.displayName = "NavigationMenuLink"

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center w-full z-50")}>
    <div className="w-full perspective-[2000px]">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-center relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-2xl shadow-black/20 backdrop-blur-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
          "data-[state=open]:slide-in-from-top-5",
          "border-border/50",
          "transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-2 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
      "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      "transition-all duration-300",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-3 w-3 rotate-45 rounded-tl-sm bg-border shadow-lg border border-border/50 backdrop-blur-sm" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

// New Components for Enhanced Layouts
const NavigationMenuGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    columns?: 1 | 2 | 3
  }
>(({ className, columns = 2, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid gap-3 p-6 w-full",
      {
        "grid-cols-1": columns === 1,
        "grid-cols-1 md:grid-cols-2": columns === 2,
        "grid-cols-1 md:grid-cols-3": columns === 3,
      },
      className
    )}
    {...props}
  />
))
NavigationMenuGrid.displayName = "NavigationMenuGrid"

const NavigationMenuSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    description?: string
  }
>(({ className, title, description, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  >
    {title && (
      <div className="px-3 py-2">
        <h3 className="font-semibold text-foreground text-sm tracking-wide">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-xs mt-1">
            {description}
          </p>
        )}
      </div>
    )}
    {props.children}
  </div>
))
NavigationMenuSection.displayName = "NavigationMenuSection"

const NavigationMenuHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-4 p-6 border-b border-border/50 bg-gradient-to-r from-accent/10 to-transparent",
      className
    )}
    {...props}
  />
))
NavigationMenuHeader.displayName = "NavigationMenuHeader"

const NavigationMenuFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-4 border-t border-border/50 bg-muted/30 rounded-b-2xl",
      className
    )}
    {...props}
  />
))
NavigationMenuFooter.displayName = "NavigationMenuFooter"

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavigationMenuGrid,
  NavigationMenuSection,
  NavigationMenuHeader,
  NavigationMenuFooter,
}