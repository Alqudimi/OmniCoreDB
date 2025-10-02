import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, Sparkles, Search, Settings, User, Bell, Home, Folder, Calendar, Mail, Star, Zap } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "18rem"
const SIDEBAR_WIDTH_MOBILE = "20rem"
const SIDEBAR_WIDTH_ICON = "4rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar transition-all duration-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset" | "glass" | "modern"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    const variantStyles = {
      sidebar: "bg-sidebar border-border",
      floating: "bg-sidebar/95 backdrop-blur-xl border border-sidebar-border shadow-2xl",
      inset: "bg-sidebar border-border",
      glass: "bg-sidebar/80 backdrop-blur-2xl border border-white/20 shadow-2xl",
      modern: "bg-gradient-to-b from-sidebar to-sidebar/80 backdrop-blur-xl border-border shadow-2xl"
    }

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col transition-all duration-500",
            variantStyles[variant],
            "rounded-2xl m-2",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className={cn(
              "w-[--sidebar-width] p-0 text-sidebar-foreground [&>button]:hidden transition-all duration-500",
              variantStyles[variant]
            )}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground md:block transition-all duration-500"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative w-[--sidebar-width] bg-transparent transition-[width] duration-500 ease-out",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset" || variant === "glass" || variant === "modern"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.6))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-500 ease-out md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset" || variant === "glass" || variant === "modern"
              ? "p-3 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.6)_+6px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col transition-all duration-500",
              variantStyles[variant],
              "rounded-2xl",
              (variant === "floating" || variant === "glass" || variant === "modern") && "shadow-2xl"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button> & {
    variant?: "default" | "elegant" | "modern"
  }
>(({ className, onClick, variant = "default", ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  const variantStyles = {
    default: "bg-background hover:bg-accent",
    elegant: "bg-sidebar/80 backdrop-blur-sm hover:bg-sidebar-accent border border-sidebar-border",
    modern: "bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20"
  }

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn(
        "h-9 w-9 transition-all duration-300 hover:scale-110 active:scale-95",
        variantStyles[variant],
        "rounded-xl shadow-sm hover:shadow-md",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4 transition-transform duration-300 group-data-[state=collapsed]:rotate-180" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    variant?: "default" | "elegant"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  const variantStyles = {
    default: "after:bg-sidebar-border hover:after:bg-primary",
    elegant: "after:bg-gradient-to-b from-transparent via-sidebar-border to-transparent hover:after:from-primary hover:after:to-primary"
  }

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all duration-500 ease-out after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] after:transition-all after:duration-300 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main"> & {
    variant?: "default" | "glass" | "modern"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-background",
    glass: "bg-background/80 backdrop-blur-lg",
    modern: "bg-gradient-to-br from-background to-muted/20"
  }

  return (
    <main
      ref={ref}
      className={cn(
        "relative flex w-full flex-1 flex-col transition-all duration-500",
        variantStyles[variant],
        "md:peer-data-[variant=inset]:m-3 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-3 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:shadow-lg",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input> & {
    variant?: "default" | "elegant" | "modern"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-background border-border",
    elegant: "bg-background/80 backdrop-blur-sm border-sidebar-border/50",
    modern: "bg-background/60 backdrop-blur-xs border-primary/20 focus:border-primary/40"
  }

  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-9 w-full transition-all duration-300 shadow-sm focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-xl",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    withSeparator?: boolean
    variant?: "default" | "elegant"
  }
>(({ className, withSeparator = true, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-transparent",
    elegant: "bg-gradient-to-r from-sidebar-accent/10 to-transparent rounded-lg mx-2"
  }

  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex flex-col gap-3 p-4 transition-all duration-300",
        variantStyles[variant],
        withSeparator && "border-b border-sidebar-border/30 pb-4",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    withSeparator?: boolean
    variant?: "default" | "elegant"
  }
>(({ className, withSeparator = true, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-transparent",
    elegant: "bg-gradient-to-r from-transparent to-sidebar-accent/10 rounded-lg mx-2"
  }

  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "flex flex-col gap-3 p-4 transition-all duration-300",
        variantStyles[variant],
        withSeparator && "border-t border-sidebar-border/30 pt-4",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator> & {
    variant?: "default" | "elegant" | "gradient"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-sidebar-border",
    elegant: "bg-gradient-to-r from-transparent via-sidebar-border/50 to-transparent",
    gradient: "bg-gradient-to-r from-primary/30 via-sidebar-border to-primary/30"
  }

  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "mx-3 w-auto transition-all duration-500 h-0.5",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    variant?: "default" | "glass"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "",
    glass: "backdrop-blur-xs"
  }

  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 overflow-auto transition-all duration-300 custom-scrollbar",
        variantStyles[variant],
        "group-data-[collapsible=icon]:overflow-hidden",
        "p-2",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    variant?: "default" | "card" | "glass"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-transparent",
    card: "bg-sidebar-accent/10 rounded-xl border border-sidebar-border/30 p-3",
    glass: "bg-sidebar-accent/5 backdrop-blur-sm rounded-xl border border-white/10 p-3"
  }

  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col transition-all duration-300",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { 
    asChild?: boolean 
    variant?: "default" | "elegant"
  }
>(({ className, asChild = false, variant = "default", ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  const variantStyles = {
    default: "text-sidebar-foreground/70",
    elegant: "text-sidebar-foreground/80 bg-sidebar-accent/10 rounded-md px-3 py-2"
  }

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-10 shrink-0 items-center rounded-lg px-3 text-sm font-semibold outline-none ring-sidebar-ring transition-all duration-300 ease-out focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-10 group-data-[collapsible=icon]:opacity-0",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { 
    asChild?: boolean 
    variant?: "default" | "elegant"
  }
>(({ className, asChild = false, variant = "default", ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  const variantStyles = {
    default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    elegant: "hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
  }

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-6 items-center justify-center rounded-lg p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-all duration-300 hover:scale-110 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm transition-all duration-300", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul"> & {
    variant?: "default" | "compact"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const spacing = variant === "compact" ? "gap-1" : "gap-2"
  
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col transition-all duration-300", spacing, className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & {
    variant?: "default" | "highlight"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "",
    highlight: "bg-sidebar-accent/10 rounded-lg border border-sidebar-accent/20"
  }

  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative transition-all duration-300", variantStyles[variant], className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-xl text-left outline-none ring-sidebar-ring transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-semibold group-has-[[data-sidebar=menu-action]]/menu-item:pr-10 [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
        elegant: "hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-transparent hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-accent/30 data-[active=true]:to-sidebar-accent/10 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:border data-[active=true]:border-sidebar-accent/30",
        modern: "hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-lg",
      },
      size: {
        sm: "h-9 text-sm px-3",
        default: "h-11 text-sm px-4",
        lg: "h-14 text-base px-4 group-data-[collapsible=icon]:!p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          className="rounded-xl shadow-lg border"
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
    variant?: "default" | "elegant"
  }
>(({ className, asChild = false, showOnHover = false, variant = "default", ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  const variantStyles = {
    default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    elegant: "hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
  }

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-2 flex aspect-square w-7 items-center justify-center rounded-lg p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-all duration-300 hover:scale-110 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        variantStyles[variant],
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    variant?: "default" | "primary" | "success" | "warning" | "destructive"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-sidebar-accent text-sidebar-accent-foreground",
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground"
  }

  return (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-2 flex h-6 min-w-6 select-none items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums transition-all duration-300",
        "peer-hover/menu-button:scale-110 peer-data-[active=true]/menu-button:scale-110",
        variantStyles[variant],
        "peer-data-[size=sm]/menu-button:top-1.5",
        "peer-data-[size=default]/menu-button:top-2.5",
        "peer-data-[size=lg]/menu-button:top-4",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
    variant?: "default" | "elegant"
  }
>(({ className, showIcon = false, variant = "default", ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  const variantStyles = {
    default: "bg-sidebar-accent/20",
    elegant: "bg-gradient-to-r from-sidebar-accent/10 to-transparent"
  }

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-11 items-center gap-3 rounded-xl px-4 transition-all duration-300", variantStyles[variant], className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-5 rounded-lg"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1 rounded"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul"> & {
    variant?: "default" | "indented"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "mx-3 border-l border-sidebar-border",
    indented: "ml-6 border-l-2 border-sidebar-accent/30"
  }

  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "flex min-w-0 translate-x-px flex-col gap-1 px-3 py-1 transition-all duration-300",
        variantStyles[variant],
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
    variant?: "default" | "elegant"
  }
>(({ asChild = false, size = "md", isActive, variant = "default", className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  const variantStyles = {
    default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
    elegant: "hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent/40 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:border-l-2 data-[active=true]:border-sidebar-accent"
  }

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-8 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-lg px-3 text-sidebar-foreground outline-none ring-sidebar-ring transition-all duration-300 hover:scale-[1.02] focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        variantStyles[variant],
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

// مكونات إضافية محسنة
const SidebarUser = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    name: string
    email: string
    avatar?: string
    variant?: "default" | "elegant" | "modern"
  }
>(({ className, name, email, avatar, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-sidebar-accent/10",
    elegant: "bg-gradient-to-r from-sidebar-accent/10 to-transparent border border-sidebar-border/30",
    modern: "bg-primary/5 border border-primary/10"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold shadow-sm">
        {avatar ? (
          <img src={avatar} alt={name} className="h-full w-full rounded-full" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 group-data-[collapsible=icon]:opacity-0">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="truncate text-xs text-sidebar-foreground/70">{email}</span>
      </div>
    </div>
  )
})
SidebarUser.displayName = "SidebarUser"

const SidebarQuickActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    actions: Array<{
      icon: React.ReactNode
      label: string
      onClick: () => void
      variant?: "default" | "primary"
    }>
  }
>(({ className, actions, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-3 gap-2 p-2 transition-all duration-300", className)}
      {...props}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant === "primary" ? "default" : "outline"}
          size="sm"
          className="h-12 flex-col gap-1 rounded-lg transition-all duration-300 hover:scale-105"
          onClick={action.onClick}
        >
          <span className="text-lg">{action.icon}</span>
          <span className="text-xs">{action.label}</span>
        </Button>
      ))}
    </div>
  )
})
SidebarQuickActions.displayName = "SidebarQuickActions"

// أنماط CSS مخصصة
const SidebarStyles = () => (
  <style jsx global>{`
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: hsl(var(--sidebar-border)) transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: hsl(var(--sidebar-border));
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--sidebar-accent));
    }
    
    @keyframes sidebar-slide-in {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .sidebar-animate-in {
      animation: sidebar-slide-in 0.3s ease-out;
    }
  `}</style>
)

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SidebarUser,
  SidebarQuickActions,
  SidebarStyles,
  useSidebar,
}