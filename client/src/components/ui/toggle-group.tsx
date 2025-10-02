"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"
import { Check, LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

// Types
interface ToggleGroupProps {
  variant?: "default" | "modern" | "pill" | "outline" | "glass"
  size?: "sm" | "md" | "lg"
  color?: "blue" | "green" | "red" | "purple" | "orange" | "gray"
  orientation?: "horizontal" | "vertical"
  fullWidth?: boolean
  showSelection?: boolean
  animated?: boolean
}

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & ToggleGroupProps
>({
  size: "default",
  variant: "default",
  color: "blue",
  orientation: "horizontal",
  fullWidth: false,
  showSelection: true,
  animated: true,
})

// Main ToggleGroup Component
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants> & ToggleGroupProps
>(({ 
  className, 
  variant = "default", 
  size = "md", 
  color = "blue",
  orientation = "horizontal",
  fullWidth = false,
  showSelection = true,
  animated = true,
  children, 
  ...props 
}, ref) => {
  const orientationStyles = {
    horizontal: "flex-row gap-1 lg:gap-2",
    vertical: "flex-col gap-2"
  }

  const widthStyles = fullWidth ? "w-full" : "w-auto"

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex items-center justify-center transition-all duration-300",
        orientationStyles[orientation],
        widthStyles,
        variant === "glass" && "backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-2xl p-2",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ 
        variant, 
        size, 
        color,
        orientation,
        fullWidth,
        showSelection,
        animated
      }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
})

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

// ToggleGroup Item Component
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants> & {
      icon?: LucideIcon
      showCheck?: boolean
      badge?: string | number
    }
>(({ 
  className, 
  children, 
  variant, 
  size, 
  icon: Icon,
  showCheck = false,
  badge,
  ...props 
}, ref) => {
  const context = React.useContext(ToggleGroupContext)

  const colors = {
    blue: {
      selected: "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25",
      unselected: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    },
    green: {
      selected: "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/25",
      unselected: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    },
    red: {
      selected: "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25",
      unselected: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    },
    purple: {
      selected: "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25",
      unselected: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    },
    orange: {
      selected: "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25",
      unselected: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    },
    gray: {
      selected: "bg-gray-500 text-white border-gray-500 shadow-lg shadow-gray-500/25",
      unselected: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  const isSelected = props['data-state'] === 'on'

  const content = (
    <motion.div
      className={cn(
        "flex items-center justify-center gap-2 transition-all duration-300",
        context.fullWidth && "flex-1",
        context.orientation === "vertical" ? "w-full" : ""
      )}
    >
      {Icon && (
        <Icon className={cn(
          "h-4 w-4 transition-colors duration-300",
          isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"
        )} />
      )}
      
      <span className={cn(
        "font-medium transition-colors duration-300",
        isSelected ? "text-white" : "text-gray-700 dark:text-gray-300"
      )}>
        {children}
      </span>

      {showCheck && isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="h-4 w-4 text-white" />
        </motion.div>
      )}

      {badge && (
        <span className={cn(
          "px-2 py-1 text-xs rounded-full font-medium transition-colors duration-300",
          isSelected 
            ? "bg-white/20 text-white" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
        )}>
          {badge}
        </span>
      )}
    </motion.div>
  )

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "relative transition-all duration-500 overflow-hidden",
        "border-2 font-medium",
        context.showSelection ? colors[context.color].unselected : "",
        "hover:scale-105 hover:shadow-md active:scale-95",
        "data-[state=on]:scale-105 data-[state=on]:shadow-lg",
        context.animated && "data-[state=on]:animate-pulse",
        context.fullWidth && "flex-1",
        context.orientation === "vertical" ? "w-full" : "",
        className
      )}
      {...props}
    >
      {context.showSelection && (
        <motion.div
          className={cn(
            "absolute inset-0 transition-all duration-500 rounded-md",
            colors[context.color].selected
          )}
          initial={false}
          animate={{ 
            scale: isSelected ? 1 : 0,
            opacity: isSelected ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      
      <div className="relative z-10">
        {content}
      </div>
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

// Enhanced ToggleGroup Components

// Segmented Control Component
const SegmentedControl = React.forwardRef<
  React.ElementRef<typeof ToggleGroup>,
  React.ComponentPropsWithoutRef<typeof ToggleGroup> & {
    items: Array<{ value: string; label: string; icon?: LucideIcon; badge?: string }>
  }
>(({ items, className, ...props }, ref) => (
  <ToggleGroup
    ref={ref}
    type="single"
    variant="pill"
    fullWidth
    className={cn("bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl", className)}
    {...props}
  >
    {items.map((item) => (
      <ToggleGroupItem
        key={item.value}
        value={item.value}
        icon={item.icon}
        badge={item.badge}
        className="flex-1 text-center"
      >
        {item.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
))
SegmentedControl.displayName = "SegmentedControl"

// Icon Toggle Group
const IconToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroup>,
  React.ComponentPropsWithoutRef<typeof ToggleGroup> & {
    items: Array<{ value: string; icon: LucideIcon; label?: string }>
  }
>(({ items, className, ...props }, ref) => (
  <ToggleGroup
    ref={ref}
    type="single"
    variant="outline"
    className={cn("p-2 rounded-2xl bg-white dark:bg-gray-800 shadow-sm", className)}
    {...props}
  >
    {items.map((item) => (
      <ToggleGroupItem
        key={item.value}
        value={item.value}
        icon={item.icon}
        className="aspect-square"
        title={item.label}
      >
        {item.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
))
IconToggleGroup.displayName = "IconToggleGroup"

// Multi Select Toggle Group
const MultiToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroup>,
  React.ComponentPropsWithoutRef<typeof ToggleGroup> & {
    items: Array<{ value: string; label: string; icon?: LucideIcon }>
  }
>(({ items, className, ...props }, ref) => (
  <ToggleGroup
    ref={ref}
    type="multiple"
    variant="modern"
    showSelection
    showCheck
    className={cn("flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl", className)}
    {...props}
  >
    {items.map((item) => (
      <ToggleGroupItem
        key={item.value}
        value={item.value}
        icon={item.icon}
        showCheck
        className="min-w-[120px]"
      >
        {item.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
))
MultiToggleGroup.displayName = "MultiToggleGroup"

export { 
  ToggleGroup, 
  ToggleGroupItem,
  SegmentedControl,
  IconToggleGroup,
  MultiToggleGroup
}