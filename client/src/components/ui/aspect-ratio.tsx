import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

// Enhanced Aspect Ratio Component with premium features
const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
    variant?: "default" | "glass" | "gradient" | "elegant"
    hoverEffect?: "scale" | "glow" | "lift" | "zoom"
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  }
>(({ 
  className, 
  variant = "default",
  hoverEffect,
  rounded = "lg",
  style,
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const variantStyles = {
    default: "bg-background border border-border/50",
    glass: cn(
      "glass-premium border border-white/20",
      "backdrop-blur-lg backdrop-saturate-150",
      "shadow-soft hover:shadow-large"
    ),
    gradient: cn(
      "bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10",
      "border border-primary/20",
      "shadow-soft"
    ),
    elegant: cn(
      "bg-gradient-to-br from-background to-muted/30",
      "border border-border/60",
      "shadow-medium",
      "relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%]",
      "hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
    )
  }

  const hoverEffects = {
    scale: "hover:scale-[1.02] transition-transform duration-500 ease-magnetic",
    glow: "hover:shadow-glow-lg transition-shadow duration-500 ease-silk",
    lift: "hover:-translate-y-2 transition-all duration-500 ease-magnetic",
    zoom: "overflow-hidden [&>img]:hover:scale-110 [&>img]:transition-transform [&>img]:duration-700 ease-silk"
  }

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full"
  }

  return (
    <AspectRatioPrimitive.Root
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden transition-all duration-500 ease-silk",
        variantStyles[variant],
        hoverEffect && hoverEffects[hoverEffect],
        roundedStyles[rounded],
        "group",
        className
      )}
      style={{
        ...style,
        transform: isHovered && hoverEffect === "lift" ? "translateY(-8px)" : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    />
  )
})
AspectRatio.displayName = "AspectRatio"

// Premium Aspect Ratio Content Component
const AspectRatioContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    overlay?: boolean
    overlayVariant?: "dark" | "gradient" | "premium"
    contentPosition?: "center" | "top" | "bottom" | "left" | "right"
  }
>(({ 
  className, 
  overlay = false,
  overlayVariant = "dark",
  contentPosition = "center",
  children,
  ...props 
}, ref) => {
  const overlayStyles = {
    dark: "bg-gradient-to-t from-black/60 via-transparent to-transparent",
    gradient: "bg-gradient-to-t from-primary/40 via-accent/20 to-transparent",
    premium: "bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/15"
  }

  const positionStyles = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-6",
    bottom: "items-end justify-center pb-6",
    left: "items-center justify-start pl-6",
    right: "items-center justify-end pr-6"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 flex",
        positionStyles[contentPosition],
        overlay && overlayStyles[overlayVariant],
        "transition-all duration-500 ease-silk",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
AspectRatioContent.displayName = "AspectRatioContent"

// Advanced Aspect Ratio with Loading Skeleton
const AspectRatioWithSkeleton = React.forwardRef<
  React.ElementRef<typeof AspectRatio>,
  React.ComponentProps<typeof AspectRatio> & {
    isLoading?: boolean
    skeletonVariant?: "pulse" | "shimmer" | "wave"
  }
>(({ 
  isLoading = false,
  skeletonVariant = "shimmer",
  children,
  className,
  ...props 
}, ref) => {
  const skeletonStyles = {
    pulse: "animate-pulse bg-muted",
    shimmer: cn(
      "relative overflow-hidden",
      "bg-gradient-to-r from-muted via-muted/50 to-muted",
      "before:absolute before:inset-0 before:-translate-x-full",
      "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      "before:animate-shimmer"
    ),
    wave: cn(
      "relative overflow-hidden",
      "bg-muted",
      "after:absolute after:inset-0 after:-translate-x-full",
      "after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent",
      "after:animate-wave"
    )
  }

  if (isLoading) {
    return (
      <AspectRatio
        ref={ref}
        className={cn(
          skeletonStyles[skeletonVariant],
          className
        )}
        {...props}
      />
    )
  }

  return (
    <AspectRatio
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </AspectRatio>
  )
})
AspectRatioWithSkeleton.displayName = "AspectRatioWithSkeleton"

// Responsive Aspect Ratio with Breakpoints
const ResponsiveAspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatio>,
  React.ComponentProps<typeof AspectRatio> & {
    ratios?: {
      base?: number
      sm?: number
      md?: number
      lg?: number
      xl?: number
    }
  }
>(({ 
  ratios = { base: 16/9, sm: 4/3, md: 21/9, lg: 16/9, xl: 3/2 },
  className,
  style,
  ...props 
}, ref) => {
  const responsiveStyle = {
    ...style,
    aspectRatio: ratios.base,
    '@media (min-width: 640px)': { aspectRatio: ratios.sm },
    '@media (min-width: 768px)': { aspectRatio: ratios.md },
    '@media (min-width: 1024px)': { aspectRatio: ratios.lg },
    '@media (min-width: 1280px)': { aspectRatio: ratios.xl },
  }

  return (
    <AspectRatio
      ref={ref}
      className={className}
      style={responsiveStyle}
      {...props}
    />
  )
})
ResponsiveAspectRatio.displayName = "ResponsiveAspectRatio"

// Aspect Ratio with Parallax Effect
const ParallaxAspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatio>,
  React.ComponentProps<typeof AspectRatio> & {
    parallaxIntensity?: number
    direction?: "vertical" | "horizontal"
  }
>(({ 
  parallaxIntensity = 0.3,
  direction = "vertical",
  children,
  className,
  ...props 
}, ref) => {
  const [offset, setOffset] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const scrollPercent = (rect.top / window.innerHeight) * 100
        setOffset(scrollPercent * parallaxIntensity)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallaxIntensity])

  return (
    <AspectRatio
      ref={ref}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <div ref={containerRef} className="absolute inset-0">
        <div
          className="absolute inset-0 transition-transform duration-100 ease-linear"
          style={{
            transform: direction === "vertical" 
              ? `translateY(${offset}px)` 
              : `translateX(${offset}px)`
          }}
        >
          {children}
        </div>
      </div>
    </AspectRatio>
  )
})
ParallaxAspectRatio.displayName = "ParallaxAspectRatio"

// Export all components
export { 
  AspectRatio, 
  AspectRatioContent,
  AspectRatioWithSkeleton,
  ResponsiveAspectRatio,
  ParallaxAspectRatio 
}