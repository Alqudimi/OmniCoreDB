import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center transition-all duration-300",
  {
    variants: {
      variant: {
        default: "",
        glass: "backdrop-blur-md bg-background/30 p-4 rounded-2xl border border-border/50",
        bordered: "p-4 rounded-xl border-2 border-border bg-background",
        minimal: "opacity-80 hover:opacity-100",
      },
      size: {
        sm: "h-6",
        md: "h-8",
        lg: "h-10",
        xl: "h-12",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const trackVariants = cva(
  "relative w-full grow overflow-hidden rounded-full transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        primary: "bg-primary/20",
        success: "bg-green-200/50 dark:bg-green-900/20",
        warning: "bg-yellow-200/50 dark:bg-yellow-900/20",
        destructive: "bg-red-200/50 dark:bg-red-900/20",
        gradient: "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600",
      },
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3",
        xl: "h-4",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const rangeVariants = cva(
  "absolute h-full transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary",
        primary: "bg-blue-500",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        destructive: "bg-red-500",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600",
        rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      animated: false,
    },
  }
)

const thumbVariants = cva(
  "block rounded-full border-2 bg-background ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary hover:scale-110 active:scale-95",
        primary: "border-blue-500 bg-blue-50 hover:scale-110 active:scale-95",
        success: "border-green-500 bg-green-50 hover:scale-110 active:scale-95",
        warning: "border-yellow-500 bg-yellow-50 hover:scale-110 active:scale-95",
        destructive: "border-red-500 bg-red-50 hover:scale-110 active:scale-95",
        glass: "border-white/50 bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-110 active:scale-95",
        glow: [
          "border-primary bg-primary text-primary-foreground shadow-lg",
          "hover:shadow-xl hover:scale-110 active:scale-95",
          "shadow-primary/25 hover:shadow-primary/35"
        ]
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-7 w-7",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  VariantProps<typeof sliderVariants>,
  VariantProps<typeof trackVariants>,
  VariantProps<typeof rangeVariants>,
  VariantProps<typeof thumbVariants> {
  showValue?: boolean
  valueFormat?: (value: number) => string
  showMarks?: boolean
  marks?: number[]
  label?: string
  description?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ 
  className, 
  variant,
  size,
  // Track props
  trackVariant,
  // Range props
  rangeVariant,
  animated,
  // Thumb props
  thumbVariant,
  // Additional props
  showValue = false,
  valueFormat,
  showMarks = false,
  marks,
  label,
  description,
  ...props 
}, ref) => {
  const [value, setValue] = React.useState(props.defaultValue || props.value || [0])
  const [isDragging, setIsDragging] = React.useState(false)

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue)
    props.onValueChange?.(newValue)
  }

  const formatValue = (val: number) => {
    if (valueFormat) return valueFormat(val)
    return val.toString()
  }

  const renderMarks = () => {
    if (!showMarks && !marks) return null
    
    const markPoints = marks || Array.from({ length: 5 }, (_, i) => {
      const min = props.min || 0
      const max = props.max || 100
      return min + (i * (max - min)) / 4
    })

    return (
      <div className="absolute inset-x-0 top-full mt-2 flex justify-between">
        {markPoints.map((mark, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={cn(
              "w-0.5 h-2 rounded-full transition-colors duration-200",
              value[0] >= mark ? "bg-primary" : "bg-muted-foreground/30"
            )} />
            <span className="text-xs text-muted-foreground mt-1">
              {formatValue(mark)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const renderValueIndicator = () => {
    if (!showValue) return null

    return (
      <div className={cn(
        "absolute -top-8 left-1/2 transform -translate-x-1/2",
        "px-2 py-1 rounded-lg text-xs font-medium bg-foreground text-background",
        "transition-all duration-300",
        isDragging ? "scale-100 opacity-100" : "scale-90 opacity-0",
        "shadow-lg"
      )}>
        {formatValue(value[0])}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
          <div className="w-2 h-2 bg-foreground rotate-45" />
        </div>
      </div>
    )
  }

  const sliderContent = (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(sliderVariants({ variant, size }), className)}
      onValueChange={handleValueChange}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      {...props}
    >
      {/* Label and Description */}
      {(label || description) && (
        <div className="absolute -top-8 left-0 right-0 flex flex-col">
          {label && (
            <label className="text-sm font-medium text-foreground mb-1">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <SliderPrimitive.Track className={cn(trackVariants({ variant: trackVariant, size }))}>
        <SliderPrimitive.Range className={cn(rangeVariants({ variant: rangeVariant, animated }))} />
      </SliderPrimitive.Track>

      {props.value?.map((_, index) => (
        <SliderPrimitive.Thumb 
          key={index} 
          className={cn(thumbVariants({ variant: thumbVariant, size }))}
          onFocus={() => setIsDragging(true)}
          onBlur={() => setIsDragging(false)}
        >
          {renderValueIndicator()}
        </SliderPrimitive.Thumb>
      ))}

      {renderMarks()}
    </SliderPrimitive.Root>
  )

  return sliderContent
})
Slider.displayName = SliderPrimitive.Root.displayName

// Enhanced Slider with Steps
const SteppedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps & {
    steps: number[]
    stepLabels?: string[]
  }
>(({ steps, stepLabels, ...props }, ref) => {
  const [currentValue, setCurrentValue] = React.useState(props.defaultValue?.[0] || props.value?.[0] || steps[0])

  const handleValueChange = (newValue: number[]) => {
    const closestStep = steps.reduce((prev, curr) => 
      Math.abs(curr - newValue[0]) < Math.abs(prev - newValue[0]) ? curr : prev
    )
    setCurrentValue(closestStep)
    props.onValueChange?.([closestStep])
  }

  const currentIndex = steps.indexOf(currentValue)

  return (
    <div className="space-y-6">
      <Slider
        ref={ref}
        {...props}
        value={[currentValue]}
        onValueChange={handleValueChange}
        showMarks={true}
        marks={steps}
      />
      
      {/* Step Labels */}
      {stepLabels && (
        <div className="flex justify-between px-2">
          {stepLabels.map((label, index) => (
            <div
              key={index}
              className={cn(
                "text-xs font-medium transition-all duration-300",
                index === currentIndex
                  ? "text-primary scale-110 font-bold"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
SteppedSlider.displayName = "SteppedSlider"

// Range Slider Component
const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>((props, ref) => {
  return (
    <Slider
      ref={ref}
      {...props}
      defaultValue={props.defaultValue || [25, 75]}
      value={props.value || [25, 75]}
      className={cn("relative", props.className)}
    />
  )
})
RangeSlider.displayName = "RangeSlider"

// Vertical Slider Component
const VerticalSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("flex items-center justify-center h-64", className)}>
      <Slider
        ref={ref}
        orientation="vertical"
        className="h-full"
        {...props}
      />
    </div>
  )
})
VerticalSlider.displayName = "VerticalSlider"

export { 
  Slider, 
  SteppedSlider, 
  RangeSlider, 
  VerticalSlider,
  sliderVariants,
  trackVariants,
  rangeVariants,
  thumbVariants
}