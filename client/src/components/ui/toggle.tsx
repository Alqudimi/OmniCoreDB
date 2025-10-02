import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Check, 
  Star, 
  Heart, 
  ThumbsUp, 
  Bookmark, 
  Bell, 
  BellOff,
  Sun,
  Moon,
  Loader2
} from "lucide-react"

import { cn } from "@/lib/utils"

// أنواع الأحجام والأنماط
type ToggleVariant = 
  | "default" 
  | "outline" 
  | "filled" 
  | "ghost" 
  | "elegant" 
  | "gradient"
  | "minimal"

type ToggleSize = "xs" | "sm" | "md" | "lg" | "xl"
type ToggleIcon = "check" | "star" | "heart" | "thumbs-up" | "bookmark" | "sun" | "moon" | "bell"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 ease-in-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: cn(
          "bg-transparent border border-transparent",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm"
        ),
        outline: cn(
          "border border-input bg-transparent",
          "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
          "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:border-accent"
        ),
        filled: cn(
          "border border-transparent bg-muted text-muted-foreground",
          "hover:bg-muted/80 hover:text-foreground",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-lg"
        ),
        ghost: cn(
          "border border-transparent bg-transparent",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        ),
        elegant: cn(
          "border border-border/50 bg-background/50 backdrop-blur-sm",
          "hover:bg-accent/50 hover:border-accent/30",
          "data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/30 data-[state=on]:shadow-sm"
        ),
        gradient: cn(
          "border border-transparent bg-gradient-to-br from-muted to-muted/80",
          "hover:from-muted/80 hover:to-muted/60",
          "data-[state=on]:from-primary data-[state=on]:to-primary/80 data-[state=on]:text-primary-foreground data-[state=on]:shadow-lg"
        ),
        minimal: cn(
          "border border-transparent bg-transparent",
          "hover:bg-transparent hover:text-foreground",
          "data-[state=on]:text-primary data-[state=on]:bg-transparent"
        ),
      },
      size: {
        xs: "h-7 px-2 min-w-7 text-xs gap-1 [&_svg]:size-3",
        sm: "h-8 px-2.5 min-w-8 text-xs gap-1.5 [&_svg]:size-3.5",
        md: "h-9 px-3 min-w-9 text-sm gap-2 [&_svg]:size-4",
        lg: "h-10 px-4 min-w-10 text-base gap-2.5 [&_svg]:size-4.5",
        xl: "h-12 px-5 min-w-12 text-lg gap-3 [&_svg]:size-5",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "md",
    },
  }
)

// أيقونات مسبقة التحديد
const toggleIcons = {
  check: Check,
  star: Star,
  heart: Heart,
  "thumbs-up": ThumbsUp,
  bookmark: Bookmark,
  sun: Sun,
  moon: Moon,
  bell: Bell,
}

interface ToggleProps 
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  icon?: ToggleIcon | React.ReactNode
  loading?: boolean
  showLabel?: boolean
  label?: string
  pressedIcon?: ToggleIcon | React.ReactNode
  tooltip?: string
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ 
  className, 
  variant, 
  size, 
  rounded,
  icon,
  loading = false,
  showLabel = true,
  label,
  pressedIcon,
  tooltip,
  children,
  ...props 
}, ref) => {
  const [isPressed, setIsPressed] = React.useState(props.defaultPressed || false)

  const getIconComponent = () => {
    if (loading) return Loader2
    
    if (isPressed && pressedIcon) {
      if (typeof pressedIcon === "string") {
        return toggleIcons[pressedIcon as ToggleIcon]
      }
      return pressedIcon
    }
    
    if (icon) {
      if (typeof icon === "string") {
        return toggleIcons[icon as ToggleIcon]
      }
      return icon
    }
    
    return null
  }

  const IconComponent = getIconComponent()

  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        toggleVariants({ variant, size, rounded }),
        "group relative",
        loading && "cursor-wait",
        className
      )}
      onPressedChange={setIsPressed}
      {...props}
    >
      {/* حالة التحميل */}
      {loading && (
        <Loader2 className={cn(
          "animate-spin absolute",
          size === "xs" && "size-3",
          size === "sm" && "size-3.5",
          size === "md" && "size-4",
          size === "lg" && "size-4.5",
          size === "xl" && "size-5"
        )} />
      )}

      {/* المحتوى الرئيسي */}
      <div className={cn(
        "flex items-center justify-center gap-2 transition-all duration-200",
        loading && "opacity-0"
      )}>
        {/* الأيقونة */}
        {IconComponent && (
          <IconComponent className={cn(
            "transition-all duration-200",
            isPressed && "scale-110",
            variant === "minimal" && isPressed && "fill-current"
          )} />
        )}

        {/* النص */}
        {(showLabel && label) && (
          <span className="font-medium whitespace-nowrap">
            {label}
          </span>
        )}

        {children}
      </div>

      {/* أداة التلميح */}
      {tooltip && (
        <div className={cn(
          "absolute -top-8 left-1/2 transform -translate-x-1/2",
          "px-2 py-1 text-xs text-white bg-gray-900 rounded-md",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "whitespace-nowrap pointer-events-none z-50"
        )}>
          {tooltip}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </TogglePrimitive.Root>
  )
})

Toggle.displayName = TogglePrimitive.Root.displayName

// مكون Toggle Group محسن
interface ToggleGroupProps 
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Group> {
  orientation?: "horizontal" | "vertical"
  spacing?: "none" | "sm" | "md" | "lg"
}

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Group>,
  ToggleGroupProps
>(({ className, orientation = "horizontal", spacing = "sm", ...props }, ref) => {
  const spacingClasses = {
    none: "gap-0",
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  }

  return (
    <TogglePrimitive.Group
      ref={ref}
      className={cn(
        "inline-flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  )
})

ToggleGroup.displayName = TogglePrimitive.Group.displayName

// مكونات Toggle مسبقة التصميم
interface IconToggleProps extends Omit<ToggleProps, 'icon' | 'children'> {
  icon: ToggleIcon
  pressedIcon?: ToggleIcon
}

const IconToggle = React.forwardRef<
  React.ElementRef<typeof Toggle>,
  IconToggleProps
>((props, ref) => {
  return <Toggle ref={ref} showLabel={false} {...props} />
})

IconToggle.displayName = "IconToggle"

// مكون Toggle مخصص للإعجابات
const LikeToggle = React.forwardRef<
  React.ElementRef<typeof Toggle>,
  Omit<ToggleProps, 'icon' | 'pressedIcon' | 'variant'>
>(({ variant = "minimal", ...props }, ref) => {
  return (
    <Toggle
      ref={ref}
      icon="thumbs-up"
      pressedIcon="thumbs-up"
      variant={variant}
      {...props}
    />
  )
})

LikeToggle.displayName = "LikeToggle"

// مكون Toggle مخصص للمفضلة
const FavoriteToggle = React.forwardRef<
  React.ElementRef<typeof Toggle>,
  Omit<ToggleProps, 'icon' | 'pressedIcon' | 'variant'>
>(({ variant = "minimal", ...props }, ref) => {
  return (
    <Toggle
      ref={ref}
      icon="heart"
      pressedIcon="heart"
      variant={variant}
      {...props}
    />
  )
})

FavoriteToggle.displayName = "FavoriteToggle"

// مكون Toggle مخصص للنجوم
const StarToggle = React.forwardRef<
  React.ElementRef<typeof Toggle>,
  Omit<ToggleProps, 'icon' | 'pressedIcon' | 'variant'>
>(({ variant = "minimal", ...props }, ref) => {
  return (
    <Toggle
      ref={ref}
      icon="star"
      pressedIcon="star"
      variant={variant}
      {...props}
    />
  )
})

StarToggle.displayName = "StarToggle"

// مكون Toggle مخصص لوضع السطوع
const ThemeToggle = React.forwardRef<
  React.ElementRef<typeof Toggle>,
  Omit<ToggleProps, 'icon' | 'pressedIcon' | 'variant'>
>(({ variant = "outline", ...props }, ref) => {
  return (
    <Toggle
      ref={ref}
      icon="sun"
      pressedIcon="moon"
      variant={variant}
      tooltip="تبديل الوضع"
      {...props}
    />
  )
})

ThemeToggle.displayName = "ThemeToggle"

export { 
  Toggle, 
  ToggleGroup, 
  IconToggle,
  LikeToggle,
  FavoriteToggle,
  StarToggle,
  ThemeToggle,
  toggleVariants 
}