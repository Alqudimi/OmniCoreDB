import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { Sparkles, Dot, Minus, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    variant?: "default" | "elegant" | "modern" | "minimal" | "gradient" | "dashed" | "dotted"
    decorative?: boolean
    withIcon?: boolean
    icon?: React.ReactNode
    label?: string
    thickness?: "thin" | "normal" | "thick" | "extra-thick"
    animate?: boolean
  }
>(
  (
    { 
      className, 
      orientation = "horizontal", 
      decorative = true, 
      variant = "default",
      withIcon = false,
      icon,
      label,
      thickness = "normal",
      animate = false,
      ...props 
    },
    ref
  ) => {
    const thicknessStyles = {
      thin: orientation === "horizontal" ? "h-px" : "w-px",
      normal: orientation === "horizontal" ? "h-[1px]" : "w-[1px]",
      thick: orientation === "horizontal" ? "h-0.5" : "w-0.5",
      "extra-thick": orientation === "horizontal" ? "h-1" : "w-1"
    }

    const variantStyles = {
      default: cn(
        "bg-border",
        "transition-all duration-300 ease-out",
        animate && "hover:scale-105"
      ),
      elegant: cn(
        "bg-gradient-to-r from-border via-muted-foreground/30 to-border",
        orientation === "vertical" && "bg-gradient-to-b from-border via-muted-foreground/30 to-border",
        "transition-all duration-500 ease-out",
        animate && "hover:scale-110"
      ),
      modern: cn(
        "bg-primary/20",
        "transition-all duration-300 ease-out",
        animate && "hover:bg-primary/30"
      ),
      minimal: cn(
        "bg-muted-foreground/20",
        "transition-all duration-200 ease-out"
      ),
      gradient: cn(
        "bg-gradient-to-r from-primary via-muted-foreground/50 to-primary",
        orientation === "vertical" && "bg-gradient-to-b from-primary via-muted-foreground/50 to-primary",
        "transition-all duration-500 ease-out",
        animate && "hover:from-primary/80 hover:to-primary/80"
      ),
      dashed: cn(
        "bg-transparent border-dashed border-border",
        orientation === "horizontal" ? "border-t" : "border-l",
        "transition-all duration-300 ease-out"
      ),
      dotted: cn(
        "bg-transparent border-dotted border-muted-foreground/40",
        orientation === "horizontal" ? "border-t" : "border-l",
        "transition-all duration-300 ease-out"
      )
    }

    const iconOptions = {
      default: <Dot className="h-4 w-4 text-muted-foreground/60" />,
      sparkle: <Sparkles className="h-4 w-4 text-muted-foreground/60" />,
      circle: <Circle className="h-3 w-3 text-muted-foreground/60" />,
      minus: <Minus className="h-4 w-4 text-muted-foreground/60" />
    }

    const selectedIcon = icon || iconOptions.default

    if (withIcon || label) {
      return (
        <div
          className={cn(
            "flex items-center gap-3",
            orientation === "horizontal" ? "w-full" : "h-full flex-col",
            className
          )}
        >
          {/* الجزء الأول من الخط */}
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0 transition-all duration-300 ease-out",
              thicknessStyles[thickness],
              variantStyles[variant],
              "flex-1"
            )}
            {...props}
          />

          {/* العنصر المركزي (أيقونة أو نص) */}
          <div className={cn(
            "flex items-center justify-center transition-all duration-300",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            animate && "hover:scale-110"
          )}>
            {withIcon && (
              <div className={cn(
                "flex items-center justify-center p-1 rounded-full transition-all duration-300",
                "bg-muted/50 border border-border/30",
                animate && "hover:bg-muted hover:border-border/50"
              )}>
                {selectedIcon}
              </div>
            )}
            {label && (
              <span className={cn(
                "text-xs font-medium text-muted-foreground/70 px-2 py-1 rounded-md",
                "bg-muted/30 border border-border/20",
                "transition-all duration-300",
                animate && "hover:bg-muted/50 hover:text-muted-foreground"
              )}>
                {label}
              </span>
            )}
          </div>

          {/* الجزء الثاني من الخط */}
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0 transition-all duration-300 ease-out",
              thicknessStyles[thickness],
              variantStyles[variant],
              "flex-1"
            )}
          />
        </div>
      )
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 transition-all duration-300 ease-out",
          thicknessStyles[thickness],
          variantStyles[variant],
          orientation === "horizontal" ? "w-full" : "h-full",
          className
        )}
        {...props}
      />
    )
  }
)
Separator.displayName = SeparatorPrimitive.Root.displayName

// مكون Separator Group للتجميع
const SeparatorGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical"
    spacing?: "none" | "sm" | "md" | "lg"
  }
>(({ className, orientation = "horizontal", spacing = "md", ...props }, ref) => {
  const spacingStyles = {
    none: "gap-0",
    sm: orientation === "horizontal" ? "gap-2" : "gap-1",
    md: orientation === "horizontal" ? "gap-4" : "gap-2",
    lg: orientation === "horizontal" ? "gap-6" : "gap-3"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex transition-all duration-300",
        orientation === "horizontal" ? "flex-col" : "flex-row",
        spacingStyles[spacing],
        className
      )}
      {...props}
    />
  )
})
SeparatorGroup.displayName = "SeparatorGroup"

// مكون Section مع Separator مدمج
const SeparatorSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    description?: string
    variant?: "default" | "elegant" | "modern"
    separatorPosition?: "top" | "bottom" | "both"
  }
>(({ 
  className, 
  title, 
  description, 
  variant = "default",
  separatorPosition = "bottom",
  ...props 
}, ref) => {
  const sectionVariants = {
    default: "bg-background border-border",
    elegant: "bg-background/50 backdrop-blur-sm border-border/50",
    modern: "bg-muted/30 border-muted-foreground/20"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Separator العلوي */}
      {separatorPosition === "top" || separatorPosition === "both" ? (
        <Separator 
          variant="elegant" 
          className="mb-4 transition-all duration-500" 
        />
      ) : null}

      {/* المحتوى */}
      <div className={cn(
        "p-4 rounded-lg border transition-all duration-300",
        sectionVariants[variant],
        "hover:shadow-sm"
      )}>
        {title && (
          <h3 className="text-lg font-semibold mb-2 transition-colors duration-300 hover:text-foreground/80">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground transition-colors duration-300 hover:text-muted-foreground/80">
            {description}
          </p>
        )}
        {props.children}
      </div>

      {/* Separator السفلي */}
      {separatorPosition === "bottom" || separatorPosition === "both" ? (
        <Separator 
          variant="elegant" 
          className="mt-4 transition-all duration-500" 
        />
      ) : null}
    </div>
  )
})
SeparatorSection.displayName = "SeparatorSection"

// مكون Divider مع نص في المنتصف
const SeparatorWithText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    text: string
    variant?: "default" | "elegant" | "modern"
    textPosition?: "center" | "left" | "right"
    icon?: React.ReactNode
  }
>(({ 
  className, 
  text, 
  variant = "default",
  textPosition = "center",
  icon,
  ...props 
}, ref) => {
  const textVariants = {
    default: "text-muted-foreground bg-background",
    elegant: "text-foreground/80 bg-background/80 backdrop-blur-sm",
    modern: "text-primary bg-primary/10"
  }

  const positionStyles = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-4 w-full transition-all duration-300",
        positionStyles[textPosition],
        className
      )}
      {...props}
    >
      <Separator 
        variant={variant} 
        className={cn(
          "flex-1 transition-all duration-500",
          textPosition === "left" && "flex-none w-8",
          textPosition === "right" && "flex-1"
        )} 
      />
      
      <div className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300",
        "border border-border/30",
        textVariants[variant],
        "hover:scale-105 hover:shadow-sm"
      )}>
        {icon && (
          <span className="flex items-center justify-center transition-transform duration-300 hover:scale-110">
            {icon}
          </span>
        )}
        <span>{text}</span>
      </div>

      <Separator 
        variant={variant} 
        className={cn(
          "flex-1 transition-all duration-500",
          textPosition === "right" && "flex-none w-8",
          textPosition === "left" && "flex-1"
        )} 
      />
    </div>
  )
})
SeparatorWithText.displayName = "SeparatorWithText"

// أنماط CSS مخصصة للحركات
const SeparatorStyles = () => (
  <style jsx global>{`
    @keyframes separator-glow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes separator-pulse {
      0%, 100% { transform: scaleX(1); }
      50% { transform: scaleX(1.05); }
    }
    
    .animate-glow {
      animation: separator-glow 2s ease-in-out infinite;
    }
    
    .animate-pulse {
      animation: separator-pulse 3s ease-in-out infinite;
    }
    
    .hover-glow:hover {
      animation: separator-glow 1s ease-in-out infinite;
    }
  `}</style>
)

export { 
  Separator, 
  SeparatorGroup, 
  SeparatorSection, 
  SeparatorWithText,
  SeparatorStyles 
}