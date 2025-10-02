"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Types
interface HoverCardProps {
  variant?: "default" | "glass" | "solid" | "bordered"
  size?: "sm" | "md" | "lg" | "xl"
  shadow?: "none" | "sm" | "md" | "lg" | "xl"
  animation?: "scale" | "fade" | "slide" | "flip"
}

// Main Components
const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> & {
    showIndicator?: boolean
  }
>(({ className, showIndicator = false, children, ...props }, ref) => (
  <HoverCardPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-block",
      showIndicator && "hover:after:content-[''] hover:after:absolute hover:after:-bottom-1 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-1 hover:after:h-1 hover:after:bg-blue-500 hover:after:rounded-full",
      className
    )}
    {...props}
  >
    {children}
  </HoverCardPrimitive.Trigger>
))
HoverCardTrigger.displayName = "HoverCardPrimitive.Trigger.displayName"

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> & HoverCardProps
>(({ 
  className, 
  align = "center", 
  sideOffset = 8, 
  variant = "default",
  size = "md",
  shadow = "lg",
  animation = "scale",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    glass: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50",
    solid: "bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
    bordered: "bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800"
  }

  const sizes = {
    sm: "w-48 p-3 text-xs",
    md: "w-64 p-4 text-sm",
    lg: "w-80 p-5 text-base",
    xl: "w-96 p-6 text-lg"
  }

  const shadows = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-xl shadow-black/10",
    xl: "shadow-2xl shadow-black/20"
  }

  const animations = {
    scale: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    fade: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    slide: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-bottom-2",
    flip: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:rotate-y-90 data-[state=open]:rotate-y-0"
  }

  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-2xl text-popover-foreground outline-none transition-all duration-300",
        "border border-gray-200/60 dark:border-gray-700/60",
        "origin-[--radix-hover-card-content-transform-origin]",
        variants[variant],
        sizes[size],
        shadows[shadow],
        animations[animation],
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "hover:shadow-2xl hover:scale-105 transition-all duration-300",
        className
      )}
      {...props}
    />
  )
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

// New Component: HoverCardHeader
const HoverCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: LucideIcon
    title?: string
    subtitle?: string
  }
>(({ className, icon: Icon, title, subtitle, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 pb-3 border-b border-gray-100 dark:border-gray-800",
      className
    )}
    {...props}
  >
    {(Icon || title || subtitle) && (
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          {title && (
            <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    )}
    {children}
  </div>
))
HoverCardHeader.displayName = "HoverCardHeader"

// New Component: HoverCardBody
const HoverCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed", className)}
    {...props}
  />
))
HoverCardBody.displayName = "HoverCardBody"

// New Component: HoverCardFooter
const HoverCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "left" | "center" | "right"
  }
>(({ className, align = "right", ...props }, ref) => {
  const alignStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800",
        alignStyles[align],
        className
      )}
      {...props}
    />
  )
})
HoverCardFooter.displayName = "HoverCardFooter"

// New Component: HoverCardImage
const HoverCardImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    aspectRatio?: "square" | "video" | "wide"
  }
>(({ className, aspectRatio = "video", ...props }, ref) => {
  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]"
  }

  return (
    <img
      ref={ref}
      className={cn(
        "w-full rounded-xl object-cover mb-3 transition-transform duration-300 hover:scale-105",
        aspectRatios[aspectRatio],
        className
      )}
      {...props}
    />
  )
})
HoverCardImage.displayName = "HoverCardImage"

// New Component: HoverCardStats
const HoverCardStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    stats: Array<{ label: string; value: string; icon?: LucideIcon }>
  }
>(({ className, stats, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid grid-cols-3 gap-4 py-3", className)}
    {...props}
  >
    {stats.map((stat, index) => (
      <div key={index} className="text-center space-y-1">
        {stat.icon && (
          <stat.icon className="h-4 w-4 mx-auto text-gray-400 dark:text-gray-500" />
        )}
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {stat.value}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {stat.label}
        </div>
      </div>
    ))}
  </div>
))
HoverCardStats.displayName = "HoverCardStats"

// New Component: HoverCardWithPreview
const HoverCardWithPreview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    preview: React.ReactNode
    content: React.ReactNode
    delay?: number
  }
>(({ className, preview, content, delay = 300, ...props }, ref) => (
  <HoverCard openDelay={delay} closeDelay={150}>
    <HoverCardTrigger asChild>
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        {preview}
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80" variant="glass" animation="slide">
      {content}
    </HoverCardContent>
  </HoverCard>
))
HoverCardWithPreview.displayName = "HoverCardWithPreview"

// Enhanced HoverCard Component with all features
const EnhancedHoverCard = ({
  children,
  content,
  ...props
}: {
  children: React.ReactNode
  content: React.ReactNode
} & HoverCardProps) => (
  <HoverCard>
    <HoverCardTrigger showIndicator>{children}</HoverCardTrigger>
    <HoverCardContent {...props}>{content}</HoverCardContent>
  </HoverCard>
)

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardHeader,
  HoverCardBody,
  HoverCardFooter,
  HoverCardImage,
  HoverCardStats,
  HoverCardWithPreview,
  EnhancedHoverCard,
}