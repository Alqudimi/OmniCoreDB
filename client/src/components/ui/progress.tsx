"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { Check, X, Loader2, AlertCircle, Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"

// أنواع الأحجام والأنماط
type ProgressSize = "sm" | "md" | "lg" | "xl"
type ProgressVariant = "default" | "modern" | "elegant" | "minimal" | "gradient" | "striped"
type ProgressStatus = "default" | "success" | "error" | "warning" | "loading" | "paused"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  size?: ProgressSize
  variant?: ProgressVariant
  status?: ProgressStatus
  showValue?: boolean
  valueFormat?: (value: number) => string
  label?: string
  helperText?: string
  animated?: boolean
  indeterminate?: boolean
  withIcon?: boolean
  onPause?: () => void
  onResume?: () => void
  isPaused?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({
  className,
  value = 0,
  size = "md",
  variant = "default",
  status = "default",
  showValue = false,
  valueFormat,
  label,
  helperText,
  animated = false,
  indeterminate = false,
  withIcon = false,
  onPause,
  onResume,
  isPaused = false,
  ...props
}, ref) => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-6",
  }

  const variantClasses = {
    default: "bg-secondary",
    modern: "bg-secondary/50 backdrop-blur-sm border",
    elegant: "bg-secondary/30 backdrop-blur-sm",
    minimal: "bg-transparent border border-border",
    gradient: "bg-gradient-to-r from-secondary to-secondary/80",
    striped: "bg-secondary",
  }

  const indicatorClasses = {
    default: "bg-primary",
    modern: "bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25",
    elegant: "bg-gradient-to-r from-primary via-primary/90 to-primary/80",
    minimal: "bg-foreground",
    gradient: "bg-gradient-to-r from-primary via-blue-500 to-cyan-500",
    striped: "bg-primary",
  }

  const statusColors = {
    default: "",
    success: "bg-success",
    error: "bg-destructive",
    warning: "bg-warning",
    loading: "bg-primary",
    paused: "bg-muted-foreground",
  }

  const statusIcons = {
    success: <Check className="h-3 w-3 text-success" />,
    error: <X className="h-3 w-3 text-destructive" />,
    warning: <AlertCircle className="h-3 w-3 text-warning" />,
    loading: <Loader2 className="h-3 w-3 animate-spin text-primary" />,
    paused: <Pause className="h-3 w-3 text-muted-foreground" />,
  }

  const getDisplayValue = () => {
    if (valueFormat) {
      return valueFormat(value || 0)
    }
    return `${Math.round(value || 0)}%`
  }

  const isComplete = value >= 100
  const showStatusIcon = withIcon && status !== "default" && !indeterminate

  return (
    <div className="space-y-3 w-full">
      {/* Header with label and value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={cn(
              "text-sm font-medium",
              status === "error" && "text-destructive",
              status === "warning" && "text-warning",
              status === "success" && "text-success"
            )}>
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <div className="flex items-center gap-2">
              {showStatusIcon && statusIcons[status]}
              <span className={cn(
                "text-sm font-medium tabular-nums",
                status === "error" && "text-destructive",
                status === "warning" && "text-warning",
                status === "success" && "text-success",
                status === "default" && "text-foreground"
              )}>
                {getDisplayValue()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full transition-all duration-300",
            sizeClasses[size],
            variantClasses[variant],
            indeterminate && "bg-gradient-to-r from-secondary via-primary/20 to-secondary animate-pulse",
            className
          )}
          {...props}
        >
          {/* Main Progress Indicator */}
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full",
              indicatorClasses[variant],
              statusColors[status],
              animated && !indeterminate && "animate-pulse",
              indeterminate && "bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer",
              variant === "striped" && "bg-stripes bg-stripes-white bg-[length:1rem_1rem]",
              isPaused && "opacity-50"
            )}
            style={{
              transform: `translateX(-${100 - (value || 0)}%)`,
              ...(indeterminate && {
                transform: 'none',
                width: '30%',
                animation: 'shimmer 2s infinite'
              })
            }}
          />

          {/* Pause/Resume Button */}
          {(onPause || onResume) && !indeterminate && (
            <button
              type="button"
              onClick={isPaused ? onResume : onPause}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all",
                "opacity-0 hover:opacity-100 focus:opacity-100",
                "bg-background/50 backdrop-blur-sm rounded-full"
              )}
              aria-label={isPaused ? "متابعة" : "إيقاف مؤقت"}
            >
              <div className={cn(
                "flex items-center justify-center rounded-full p-1",
                "bg-foreground text-background shadow-lg transition-transform hover:scale-110"
              )}>
                {isPaused ? (
                  <Play className="h-3 w-3 ml-0.5" />
                ) : (
                  <Pause className="h-3 w-3" />
                )}
              </div>
            </button>
          )}
        </ProgressPrimitive.Root>

        {/* Helper Text */}
        {helperText && (
          <p className={cn(
            "text-xs font-medium",
            status === "error" && "text-destructive",
            status === "warning" && "text-warning",
            status === "success" && "text-success",
            status === "default" && "text-muted-foreground"
          )}>
            {helperText}
          </p>
        )}
      </div>

      {/* Custom Styles for Animations */}
      {isMounted && (
        <style jsx global>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(400%);
            }
          }

          .bg-stripes {
            background-image: linear-gradient(
              45deg,
              transparent 25%,
              rgba(255, 255, 255, 0.1) 25%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 50%,
              transparent 75%,
              rgba(255, 255, 255, 0.1) 75%,
              rgba(255, 255, 255, 0.1) 100%
            );
          }
        `}</style>
      )}
    </div>
  )
})
Progress.displayName = "Progress"

// مكون Progress Steps لتقدم متعدد المراحل
interface ProgressStepsProps {
  steps: string[]
  currentStep: number
  size?: ProgressSize
  variant?: ProgressVariant
  className?: string
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  size = "md",
  variant = "default",
  className,
}) => {
  const progressValue = (currentStep / (steps.length - 1)) * 100

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Bar */}
      <Progress
        value={progressValue}
        size={size}
        variant={variant}
        showValue={false}
        animated
      />

      {/* Steps Labels */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex flex-col items-center gap-2"
          >
            {/* Step Indicator */}
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                index <= currentStep
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border-muted-foreground/30 bg-background text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>

            {/* Step Label */}
            <span
              className={cn(
                "text-xs font-medium max-w-20 text-center leading-tight",
                index <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// مكون Circular Progress
interface CircularProgressProps extends Omit<ProgressProps, 'value'> {
  value: number
  size?: number
  strokeWidth?: number
  withText?: boolean
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(({
  value,
  size = 40,
  strokeWidth = 4,
  withText = false,
  variant = "default",
  status = "default",
  className,
  ...props
}, ref) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const statusColors = {
    default: "text-primary",
    success: "text-success",
    error: "text-destructive",
    warning: "text-warning",
    loading: "text-primary",
    paused: "text-muted-foreground",
  }

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-secondary opacity-30"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-500 ease-out",
            statusColors[status]
          )}
        />
      </svg>

      {/* Center Text */}
      {withText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "text-xs font-bold tabular-nums",
            statusColors[status]
          )}>
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  )
})
CircularProgress.displayName = "CircularProgress"

export { Progress, ProgressSteps, CircularProgress }