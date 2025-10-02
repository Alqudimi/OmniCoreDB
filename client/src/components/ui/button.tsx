import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Loader2, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  Zap,
  Star
} from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-2xl text-base font-semibold transition-all duration-500 ease-magnetic relative overflow-hidden group",
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50 disabled:scale-100",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-all [&_svg]:duration-300",
  "active:scale-95",
  {
    variants: {
      variant: {
        default: cn(
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25",
          "hover:shadow-xl hover:shadow-primary/35 hover:from-primary/90 hover:to-primary/70",
          "hover:scale-105 hover:-translate-y-0.5",
          "border border-primary/20"
        ),
        destructive: cn(
          "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg shadow-destructive/25",
          "hover:shadow-xl hover:shadow-destructive/35 hover:from-destructive/90 hover:to-destructive/70",
          "hover:scale-105 hover:-translate-y-0.5",
          "border border-destructive/20"
        ),
        outline: cn(
          "border-2 border-border bg-transparent text-foreground backdrop-blur-sm",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
          "hover:scale-105 hover:shadow-lg",
          "hover:[&_svg]:translate-x-1"
        ),
        secondary: cn(
          "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-lg shadow-secondary/25",
          "hover:shadow-xl hover:shadow-secondary/35 hover:from-secondary/90 hover:to-secondary/70",
          "hover:scale-105 hover:-translate-y-0.5",
          "border border-secondary/20"
        ),
        ghost: cn(
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
          "hover:scale-105 hover:shadow-md",
          "[&_svg]:hover:scale-110"
        ),
        link: cn(
          "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto",
          "hover:no-underline hover:text-primary/80",
          "[&_svg]:hover:translate-x-1"
        ),
        premium: cn(
          "bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white shadow-2xl shadow-primary/40",
          "hover:shadow-3xl hover:shadow-primary/60 hover:scale-105 hover:-translate-y-1",
          "border-0 relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/10 before:translate-x-[-100%]",
          "hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
        ),
        glass: cn(
          "glass-card border border-white/20 text-foreground backdrop-blur-lg",
          "hover:bg-white/10 hover:border-white/30 hover:scale-105",
          "hover:shadow-glow",
          "[&_svg]:hover:scale-110"
        ),
        success: cn(
          "bg-gradient-to-r from-success to-success/80 text-success-foreground shadow-lg shadow-success/25",
          "hover:shadow-xl hover:shadow-success/35 hover:from-success/90 hover:to-success/70",
          "hover:scale-105 hover:-translate-y-0.5",
          "border border-success/20"
        ),
        warning: cn(
          "bg-gradient-to-r from-warning to-warning/80 text-warning-foreground shadow-lg shadow-warning/25",
          "hover:shadow-xl hover:shadow-warning/35 hover:from-warning/90 hover:to-warning/70",
          "hover:scale-105 hover:-translate-y-0.5",
          "border border-warning/20"
        )
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-lg gap-2 [&_svg]:size-3",
        sm: "h-10 px-4 text-sm rounded-xl gap-2 [&_svg]:size-4",
        default: "h-12 px-6 text-base rounded-2xl gap-3 [&_svg]:size-5",
        lg: "h-14 px-8 text-lg rounded-2xl gap-3 [&_svg]:size-5",
        xl: "h-16 px-10 text-xl rounded-3xl gap-4 [&_svg]:size-6",
        icon: cn(
          "rounded-2xl transition-all duration-500 ease-magnetic",
          "hover:scale-110 hover:rotate-12 hover:shadow-lg"
        )
      },
      animation: {
        none: "",
        pulse: "animate-pulse-slow",
        bounce: "hover:animate-bounce",
        glow: "shadow-glow hover:shadow-glow-lg",
        sparkle: "relative overflow-hidden"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none"
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  success?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    success = false,
    icon,
    iconPosition = "left",
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [isSuccess, setIsSuccess] = React.useState(false)

    React.useEffect(() => {
      if (success) {
        setIsSuccess(true)
        const timer = setTimeout(() => setIsSuccess(false), 2000)
        return () => clearTimeout(timer)
      }
    }, [success])

    // Sparkle effect for premium variant
    const SparkleEffect = variant === "premium" ? (
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Sparkles className="absolute -bottom-1 -left-1 size-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150" />
      </>
    ) : null

    const getIcon = () => {
      if (loading) {
        return <Loader2 className="animate-spin" />
      }
      if (isSuccess) {
        return <CheckCircle2 className="text-success animate-in zoom-in-50" />
      }
      if (icon) {
        return icon
      }
      return null
    }

    const currentIcon = getIcon()

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, animation }),
          fullWidth && "w-full",
          loading && "cursor-wait",
          isSuccess && "bg-success text-success-foreground border-success/20",
          "relative overflow-hidden",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Background Effects */}
        {SparkleEffect}

        {/* Loading/Success Overlay */}
        {(loading || isSuccess) && (
          <div className="absolute inset-0 bg-current/10 rounded-inherit" />
        )}

        {/* Icon and Content */}
        <div className={cn(
          "flex items-center justify-center gap-3 relative z-10",
          iconPosition === "right" && "flex-row-reverse"
        )}>
          {currentIcon && iconPosition === "left" && currentIcon}
          <span className={cn(
            "transition-all duration-300",
            loading && "opacity-0",
            isSuccess && "scale-110"
          )}>
            {children}
          </span>
          {currentIcon && iconPosition === "right" && currentIcon}
        </div>

        {/* Ripple Effect */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="ripple-effect absolute bg-white/30 rounded-full scale-0 opacity-0 transition-all duration-600 ease-out group-active:scale-100 group-active:opacity-100" />
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Specialized Button Components

// Icon Button with enhanced styling
const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button
      ref={ref}
      size="icon"
      variant={props.variant || "outline"}
      {...props}
    />
  )
)
IconButton.displayName = "IconButton"

// Floating Action Button
const FabButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "rounded-full shadow-2xl hover:shadow-3xl fixed bottom-8 right-8 z-50",
        "animate-in fade-in-90 slide-in-from-bottom-4",
        className
      )}
      size="xl"
      variant="premium"
      {...props}
    />
  )
)
FabButton.displayName = "FabButton"

// Button Group Component
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  orientation?: "horizontal" | "vertical"
  attached?: boolean
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = "horizontal",
  attached = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex gap-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        attached && "rounded-2xl overflow-hidden shadow-lg",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => 
        React.isValidElement(child) 
          ? React.cloneElement(child, {
              // @ts-ignore
              className: cn(
                child.props.className,
                attached && "rounded-none shadow-none",
                attached && orientation === "horizontal" && [
                  index === 0 && "rounded-r-none",
                  index === React.Children.count(children) - 1 && "rounded-l-none",
                  index > 0 && index < React.Children.count(children) - 1 && "rounded-none"
                ],
                attached && orientation === "vertical" && [
                  index === 0 && "rounded-b-none",
                  index === React.Children.count(children) - 1 && "rounded-t-none",
                  index > 0 && index < React.Children.count(children) - 1 && "rounded-none"
                ]
              )
            })
          : child
      )}
    </div>
  )
}

// Enhanced Button with Count
interface ButtonWithCountProps extends ButtonProps {
  count?: number
  countVariant?: "default" | "primary" | "destructive"
}

const ButtonWithCount: React.FC<ButtonWithCountProps> = ({
  count,
  countVariant = "default",
  children,
  ...props
}) => {
  const countColors = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground"
  }

  return (
    <Button {...props}>
      {children}
      {count !== undefined && (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-bold min-w-6 h-6 flex items-center justify-center",
          "transition-all duration-300 group-hover:scale-110",
          countColors[countVariant]
        )}>
          {count}
        </span>
      )}
    </Button>
  )
}

export { 
  Button, 
  IconButton, 
  FabButton, 
  ButtonGroup, 
  ButtonWithCount,
  buttonVariants 
}