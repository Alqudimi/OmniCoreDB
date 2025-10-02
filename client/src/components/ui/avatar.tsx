"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-500 ease-magnetic",
      "h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16",
      "bg-gradient-to-br from-primary/20 to-muted/40",
      "shadow-soft hover:shadow-large",
      "border border-white/20 dark:border-white/10",
      "hover:scale-105 active:scale-95",
      "group cursor-pointer",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover transition-all duration-700 ease-silk",
      "group-hover:scale-110",
      "rounded-inherit",
      className
    )}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-gradient-to-br from-primary/15 via-primary/10 to-muted/20",
      "text-foreground/70 font-semibold",
      "text-sm md:text-base lg:text-lg",
      "border border-white/30 dark:border-white/15",
      "shadow-inner-lg",
      "transition-all duration-500 ease-silk",
      "group-hover:from-primary/25 group-hover:to-muted/30",
      "group-hover:text-foreground/90",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Premium Avatar Group Component
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  max?: number
  direction?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg" | "xl"
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 5, direction = "horizontal", size = "md", className, ...props }, ref) => {
    const avatars = React.Children.toArray(children)
    const displayedAvatars = max ? avatars.slice(0, max) : avatars
    const remainingCount = max ? avatars.length - max : 0

    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          direction === "horizontal" ? "flex-row -space-x-2" : "flex-col -space-y-2",
          "p-1",
          className
        )}
        {...props}
      >
        {displayedAvatars.map((avatar, index) => (
          <div
            key={index}
            className={cn(
              "transition-transform duration-500 ease-magnetic",
              "hover:scale-110 hover:z-10",
              "rounded-full border-2 border-background dark:border-background",
              "shadow-medium hover:shadow-large"
            )}
            style={{
              zIndex: displayedAvatars.length - index,
              transform: `translateX(${index * -8}px)`
            }}
          >
            {React.isValidElement(avatar) 
              ? React.cloneElement(avatar, {
                  // @ts-ignore
                  className: cn(sizeClasses[size], avatar.props.className)
                })
              : avatar
            }
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full",
              "bg-gradient-to-br from-primary/20 to-muted/40",
              "border-2 border-background dark:border-background",
              "text-foreground/70 font-medium",
              "shadow-medium",
              sizeClasses[size]
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

// Premium Avatar with Status Indicator
interface AvatarWithStatusProps extends React.ComponentProps<typeof Avatar> {
  status?: "online" | "offline" | "away" | "busy"
  statusPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}

const AvatarWithStatus = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  AvatarWithStatusProps
>(({ status = "online", statusPosition = "bottom-right", className, ...props }, ref) => {
  const statusColors = {
    online: "bg-success",
    offline: "bg-muted-foreground/50",
    away: "bg-warning",
    busy: "bg-destructive"
  }

  const positionClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0"
  }

  return (
    <div className="relative inline-block">
      <Avatar
        ref={ref}
        className={cn("group", className)}
        {...props}
      />
      <div
        className={cn(
          "absolute w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-background",
          "transition-all duration-300 ease-silk",
          "group-hover:scale-125 group-hover:shadow-glow",
          statusColors[status],
          positionClasses[statusPosition]
        )}
      />
    </div>
  )
})
AvatarWithStatus.displayName = "AvatarWithStatus"

// Premium Avatar with Tooltip
interface AvatarWithTooltipProps extends React.ComponentProps<typeof Avatar> {
  name: string
  role?: string
}

const AvatarWithTooltip = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  AvatarWithTooltipProps
>(({ name, role, className, ...props }, ref) => {
  const [showTooltip, setShowTooltip] = React.useState(false)

  return (
    <div className="relative inline-block">
      <Avatar
        ref={ref}
        className={cn("cursor-help", className)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...props}
      />
      
      {showTooltip && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2",
            "px-3 py-2 rounded-xl",
            "bg-popover text-popover-foreground",
            "border border-border/50",
            "shadow-2xl",
            "text-sm font-medium whitespace-nowrap",
            "z-tooltip",
            "animate-fade-in-up"
          )}
        >
          <div className="font-semibold">{name}</div>
          {role && (
            <div className="text-xs text-muted-foreground mt-1">{role}</div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </div>
  )
})
AvatarWithTooltip.displayName = "AvatarWithTooltip"

export { 
  Avatar, 
  AvatarImage, 
  AvatarFallback, 
  AvatarGroup,
  AvatarWithStatus,
  AvatarWithTooltip
}