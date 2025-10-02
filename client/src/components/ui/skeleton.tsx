import { cn } from "@/lib/utils"

// أنواع الأحجام والأنماط
type SkeletonVariant = "default" | "pulse" | "shimmer" | "wave" | "fade" | "glow"
type SkeletonShape = "rectangle" | "circle" | "text" | "custom"
type SkeletonSize = "xs" | "sm" | "md" | "lg" | "xl"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  shape?: SkeletonShape
  size?: SkeletonSize
  lines?: number
  animated?: boolean
  speed?: "slow" | "normal" | "fast"
  gradient?: boolean
  rounded?: "none" | "sm" | "md" | "lg" | "full"
}

function Skeleton({
  className,
  variant = "default",
  shape = "rectangle",
  size = "md",
  lines = 1,
  animated = true,
  speed = "normal",
  gradient = false,
  rounded = "md",
  children,
  ...props
}: SkeletonProps) {
  const speedClasses = {
    slow: "duration-1000",
    normal: "duration-500",
    fast: "duration-300",
  }

  const sizeClasses = {
    xs: "h-3",
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
    xl: "h-8",
  }

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }

  const variantClasses = {
    default: "bg-muted",
    pulse: "bg-muted",
    shimmer: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
    wave: "bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%]",
    fade: "bg-muted",
    glow: "bg-muted shadow-lg shadow-muted/30",
  }

  const animationClasses = {
    default: animated ? "animate-pulse" : "",
    pulse: animated ? "animate-pulse" : "",
    shimmer: animated ? "animate-shimmer" : "",
    wave: animated ? "animate-wave" : "",
    fade: animated ? "animate-fade" : "",
    glow: animated ? "animate-glow" : "",
  }

  const shapeClasses = {
    rectangle: "",
    circle: "rounded-full aspect-square",
    text: "rounded",
    custom: "",
  }

  // إذا كان shape هو text وكان lines أكثر من 1، نعيد مجموعة من الأسطر
  if (shape === "text" && lines > 1) {
    return (
      <div className="space-y-2 w-full">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(
              "w-full",
              variantClasses[variant],
              animationClasses[variant],
              speedClasses[speed],
              roundedClasses[rounded],
              shape === "text" && sizeClasses[size],
              gradient && "bg-gradient-to-r from-muted to-muted/70",
              index === lines - 1 && "w-3/4", // السطر الأخير أقصر
              className
            )}
            {...props}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        animationClasses[variant],
        speedClasses[speed],
        roundedClasses[rounded],
        shapeClasses[shape],
        shape === "text" && sizeClasses[size],
        gradient && "bg-gradient-to-r from-muted to-muted/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// مكون Skeleton Group لتنظيم عدة skeletons
interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "none" | "sm" | "md" | "lg"
  direction?: "vertical" | "horizontal"
  align?: "start" | "center" | "end"
}

function SkeletonGroup({
  className,
  spacing = "md",
  direction = "vertical",
  align = "start",
  children,
  ...props
}: SkeletonGroupProps) {
  const spacingClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }

  const directionClasses = {
    vertical: "flex-col",
    horizontal: "flex-row flex-wrap",
  }

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  }

  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// مكونات Skeleton مسبقة التصميم
interface AvatarSkeletonProps extends Omit<SkeletonProps, 'shape' | 'size'> {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

function AvatarSkeleton({ size = "md", className, ...props }: AvatarSkeletonProps) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  return (
    <Skeleton
      shape="circle"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
}

interface CardSkeletonProps extends Omit<SkeletonProps, 'shape'> {
  withImage?: boolean
  withActions?: boolean
}

function CardSkeleton({ 
  withImage = false, 
  withActions = false, 
  className, 
  ...props 
}: CardSkeletonProps) {
  return (
    <div className={cn("space-y-4 p-4 border rounded-lg", className)}>
      {withImage && (
        <Skeleton className="h-40 w-full rounded-md" />
      )}
      
      <div className="space-y-3">
        <Skeleton shape="text" size="lg" className="w-3/4" />
        <Skeleton shape="text" size="sm" lines={2} />
        
        {withActions && (
          <div className="flex gap-2 pt-2">
            <Skeleton shape="text" size="sm" className="w-20 h-8" />
            <Skeleton shape="text" size="sm" className="w-20 h-8" />
          </div>
        )}
      </div>
    </div>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
  withHeader?: boolean
  className?: string
}

function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  withHeader = true,
  className 
}: TableSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {withHeader && (
        <div className="flex gap-2 pb-4">
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton
              key={`header-${index}`}
              shape="text"
              size="sm"
              className={cn(
                "flex-1",
                index === columns - 1 && "w-20" // العمود الأخير أصغر
              )}
            />
          ))}
        </div>
      )}
      
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={`row-${rowIndex}-col-${colIndex}`}
              shape="text"
              size="sm"
              className={cn(
                "flex-1",
                colIndex === columns - 1 && "w-20" // العمود الأخير أصغر
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// مكون Profile Skeleton
function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      <div className="flex items-center gap-4">
        <AvatarSkeleton size="lg" />
        <div className="space-y-2 flex-1">
          <Skeleton shape="text" size="lg" className="w-1/2" />
          <Skeleton shape="text" size="sm" className="w-3/4" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton shape="text" size="md" className="w-full" />
        <Skeleton shape="text" size="md" lines={3} />
      </div>
      
      <div className="flex gap-2">
        <Skeleton className="w-24 h-9 rounded-full" />
        <Skeleton className="w-24 h-9 rounded-full" />
      </div>
    </div>
  )
}

// إضافة الأنماط المخصصة للـ CSS animations
const SkeletonStyles = () => (
  <style jsx global>{`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    @keyframes wave {
      0% {
        background-position: -200% 0;
      }
      50% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    @keyframes fade {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    @keyframes glow {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 20px rgba(100, 100, 100, 0.1);
      }
      50% {
        opacity: 0.7;
        box-shadow: 0 0 30px rgba(100, 100, 100, 0.3);
      }
    }

    .animate-shimmer {
      animation: shimmer 2s infinite linear;
    }

    .animate-wave {
      animation: wave 3s infinite ease-in-out;
    }

    .animate-fade {
      animation: fade 2s infinite ease-in-out;
    }

    .animate-glow {
      animation: glow 2s infinite ease-in-out;
    }
  `}</style>
)

export { 
  Skeleton, 
  SkeletonGroup, 
  AvatarSkeleton, 
  CardSkeleton, 
  TableSkeleton, 
  ProfileSkeleton,
  SkeletonStyles 
}