import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { 
  Sparkles, 
  Star, 
  Shield, 
  Zap, 
  TrendingUp,
  ArrowUpRight,
  Heart
} from "lucide-react"

const cardVariants = cva(
  "relative overflow-hidden transition-all duration-700 ease-silk",
  {
    variants: {
      variant: {
        default: "bg-card border border-border/50 shadow-soft",
        glass: "glass-card border border-white/20 backdrop-blur-lg",
        elevated: "bg-card border border-border shadow-medium hover:shadow-large",
        premium: "bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 shadow-glow",
        gradient: "bg-gradient-to-br from-primary to-primary/80 border-0 text-white",
        minimalist: "bg-transparent border border-border/30 shadow-none",
        animated: "bg-card border border-border/50 hover:shadow-glow hover:border-primary/30"
      },
      size: {
        sm: "rounded-xl",
        md: "rounded-2xl",
        lg: "rounded-3xl",
        xl: "rounded-3xl"
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-2 hover:shadow-xl",
        scale: "hover:scale-[1.02]",
        glow: "hover:shadow-glow-lg hover:border-primary/40",
        "3d": "hover:rotate-x-2 hover:rotate-y-2 hover:shadow-2xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "lift"
    }
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof cardVariants> & {
    glowEffect?: boolean
    borderGradient?: boolean
    spotlight?: boolean
  }
>(({ 
  className, 
  variant, 
  size, 
  hover,
  glowEffect = false,
  borderGradient = false,
  spotlight = false,
  children,
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlight) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size, hover }),
        glowEffect && "shadow-glow hover:shadow-glow-lg",
        "group cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Border Gradient Effect */}
      {borderGradient && (
        <div className={cn(
          "absolute inset-0 rounded-inherit p-[1px] bg-gradient-to-br from-primary via-accent to-secondary opacity-0",
          "group-hover:opacity-100 transition-opacity duration-500",
          "z-0"
        )}>
          <div className="w-full h-full bg-card rounded-inherit" />
        </div>
      )}

      {/* Spotlight Effect */}
      {spotlight && (
        <div
          className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(84, 131, 179, 0.1), transparent 40%)`
          }}
        />
      )}

      {/* Animated Background */}
      {variant === "animated" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      )}

      {/* Content Container */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Corner Accents */}
      {(variant === "premium" || variant === "gradient") && (
        <>
          <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-primary to-transparent rounded-tl-inherit opacity-20" />
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-primary to-transparent rounded-br-inherit opacity-20" />
        </>
      )}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withIcon?: boolean
    icon?: React.ReactNode
    iconPosition?: "left" | "right" | "top"
  }
>(({ className, withIcon = false, icon, iconPosition = "left", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-3 p-6 pb-3",
      withIcon && "relative",
      iconPosition === "top" && "items-center text-center",
      iconPosition === "right" && "flex-row-reverse justify-between items-start",
      className
    )}
    {...props}
  >
    {withIcon && icon && (
      <div className={cn(
        "flex items-center justify-center p-3 rounded-2xl mb-2 transition-all duration-500 ease-magnetic group-hover:scale-110",
        iconPosition === "top" && "self-center",
        iconPosition === "left" && "self-start",
        iconPosition === "right" && "self-end",
        "bg-primary/10 text-primary"
      )}>
        {icon}
      </div>
    )}
    {props.children}
  </div>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    gradient?: boolean
    withBadge?: boolean
    badge?: React.ReactNode
  }
>(({ className, as: Comp = "h3", gradient = false, withBadge = false, badge, children, ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-tight flex items-center gap-3",
      gradient && "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",
      "group-hover:translate-x-1 transition-transform duration-300",
      withBadge && "justify-between",
      className
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    {withBadge && badge && (
      <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
        {badge}
      </span>
    )}
  </Comp>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animated?: boolean
  }
>(({ className, animated = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground leading-relaxed",
      animated && "transition-all duration-500 group-hover:text-foreground/80",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean
    gradientOverlay?: boolean
  }
>(({ className, noPadding = false, gradientOverlay = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      !noPadding && "p-6 pt-0",
      "relative",
      gradientOverlay && "after:absolute after:inset-x-0 after:bottom-0 after:h-8 after:bg-gradient-to-t after:from-card after:to-transparent",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end" | "between"
    withAction?: boolean
  }
>(({ className, align = "start", withAction = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-3 gap-3",
      align === "start" && "justify-start",
      align === "center" && "justify-center",
      align === "end" && "justify-end",
      align === "between" && "justify-between",
      withAction && "border-t border-border/50 pt-4 mt-4",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced Card with Image
interface CardWithImageProps extends React.ComponentProps<typeof Card> {
  imageSrc: string
  imageAlt: string
  imageHeight?: string
  overlayContent?: boolean
}

const CardWithImage: React.FC<CardWithImageProps> = ({
  imageSrc,
  imageAlt,
  imageHeight = "200px",
  overlayContent = false,
  children,
  className,
  ...props
}) => {
  return (
    <Card className={cn("p-0 overflow-hidden", className)} {...props}>
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ height: imageHeight }}
        />
        {overlayContent && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
      </div>
      <div className={cn(overlayContent && "absolute bottom-0 left-0 right-0 p-6 text-white")}>
        {children}
      </div>
    </Card>
  )
}

// Stat Card Component
interface StatCardProps extends React.ComponentProps<typeof Card> {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon = <TrendingUp className="h-4 w-4" />,
  trend = "up",
  className,
  ...props
}) => {
  const trendColors = {
    up: "text-success",
    down: "text-destructive", 
    neutral: "text-muted-foreground"
  }

  return (
    <Card className={cn("p-6", className)} {...props}>
      <CardHeader className="flex-row items-center justify-between p-0 mb-4">
        <CardDescription>{title}</CardDescription>
        <div className={cn("p-2 rounded-lg", trendColors[trend], "bg-current/10")}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-end justify-between">
          <CardTitle className="text-3xl font-bold">{value}</CardTitle>
          {change !== undefined && (
            <span className={cn("flex items-center gap-1 text-sm font-medium", trendColors[trend])}>
              <ArrowUpRight className={cn("h-3 w-3", trend === "down" && "rotate-90")} />
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Feature Card Component
const FeatureCard: React.FC<React.ComponentProps<typeof Card> & {
  icon: React.ReactNode
  title: string
  description: string
  comingSoon?: boolean
}> = ({ icon, title, description, comingSoon = false, ...props }) => {
  return (
    <Card variant="glass" hover="glow" {...props}>
      <CardHeader withIcon icon={icon} iconPosition="top">
        <CardTitle withBadge badge={comingSoon ? "قريباً" : undefined}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardWithImage,
  StatCard,
  FeatureCard,
  cardVariants
}