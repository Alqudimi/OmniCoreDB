import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { Check, X, Sun, Moon, LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

// Types
interface SwitchProps {
  variant?: "default" | "modern" | "ios" | "material" | "minimal"
  size?: "sm" | "md" | "lg"
  color?: "blue" | "green" | "red" | "purple" | "orange" | "gray"
  icons?: boolean
  showLabels?: boolean
  labels?: { checked: string; unchecked: string }
  customIcons?: { checked?: LucideIcon; unchecked?: LucideIcon }
}

// Enhanced Switch Component
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & SwitchProps
>(({ 
  className, 
  variant = "default",
  size = "md",
  color = "blue",
  icons = false,
  showLabels = false,
  labels = { checked: "مفعل", unchecked: "معطل" },
  customIcons,
  ...props 
}, ref) => {
  const variants = {
    default: "rounded-full border-2 border-transparent",
    modern: "rounded-xl border-0 shadow-inner",
    ios: "rounded-full border-0 shadow-sm",
    material: "rounded-full border-0",
    minimal: "rounded-full border border-gray-300 dark:border-gray-600"
  }

  const sizes = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-8 w-14"
  }

  const thumbSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7"
  }

  const colors = {
    blue: {
      checked: "bg-gradient-to-r from-blue-500 to-blue-600",
      unchecked: "bg-gray-300 dark:bg-gray-600"
    },
    green: {
      checked: "bg-gradient-to-r from-green-500 to-green-600",
      unchecked: "bg-gray-300 dark:bg-gray-600"
    },
    red: {
      checked: "bg-gradient-to-r from-red-500 to-red-600",
      unchecked: "bg-gray-300 dark:bg-gray-600"
    },
    purple: {
      checked: "bg-gradient-to-r from-purple-500 to-purple-600",
      unchecked: "bg-gray-300 dark:bg-gray-600"
    },
    orange: {
      checked: "bg-gradient-to-r from-orange-500 to-orange-600",
      unchecked: "bg-gray-300 dark:bg-gray-600"
    },
    gray: {
      checked: "bg-gradient-to-r from-gray-500 to-gray-600",
      unchecked: "bg-gray-300 dark:bg-gray-600"
    }
  }

  const iconSizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  }

  const translateX = {
    sm: "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
    md: "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
    lg: "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
  }

  const CheckIcon = customIcons?.checked || Check
  const UncheckIcon = customIcons?.unchecked || X

  return (
    <div className="flex items-center gap-3">
      {showLabels && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            props.checked ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {props.checked ? labels.checked : labels.unchecked}
        </motion.span>
      )}
      
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center transition-all duration-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          "hover:scale-105 active:scale-95",
          variants[variant],
          sizes[size],
          colors[color].unchecked,
          "data-[state=checked]:shadow-lg data-[state=checked]:shadow-blue-500/25",
          variant === "modern" && "data-[state=checked]:shadow-lg data-[state=unchecked]:shadow-inner",
          variant === "ios" && "data-[state=checked]:shadow-md data-[state=unchecked]:shadow-sm",
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-all duration-500",
            "flex items-center justify-center",
            thumbSizes[size],
            translateX[size],
            variant === "modern" && "shadow-md",
            variant === "ios" && "shadow-sm",
            variant === "material" && "shadow-none",
            props.checked ? colors[color].checked : "bg-white dark:bg-gray-100"
          )}
        >
          <AnimatePresence mode="wait">
            {icons && (
              <motion.div
                key={props.checked ? "checked" : "unchecked"}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="flex items-center justify-center"
              >
                {props.checked ? (
                  <CheckIcon className={cn(
                    iconSizes[size],
                    "text-white font-bold"
                  )} />
                ) : (
                  <UncheckIcon className={cn(
                    iconSizes[size],
                    "text-gray-400"
                  )} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    </div>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

// Specialized Switch Components

// Toggle Switch for Dark Mode
const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  React.ComponentPropsWithoutRef<typeof Switch>
>(({ className, ...props }, ref) => (
  <Switch
    ref={ref}
    variant="ios"
    size="lg"
    color="blue"
    icons
    customIcons={{ checked: Moon, unchecked: Sun }}
    showLabels
    labels={{ checked: "مظلم", unchecked: "فاتح" }}
    className={cn("bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800", className)}
    {...props}
  />
))
ThemeSwitch.displayName = "ThemeSwitch"

// Notification Switch
const NotificationSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  React.ComponentPropsWithoutRef<typeof Switch>
>(({ className, ...props }, ref) => (
  <Switch
    ref={ref}
    variant="modern"
    size="md"
    color="green"
    icons
    showLabels
    labels={{ checked: "مفعل", unchecked: "معطل" }}
    className={className}
    {...props}
  />
))
NotificationSwitch.displayName = "NotificationSwitch"

// Danger Switch
const DangerSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  React.ComponentPropsWithoutRef<typeof Switch>
>(({ className, ...props }, ref) => (
  <Switch
    ref={ref}
    variant="default"
    size="md"
    color="red"
    icons
    showLabels
    labels={{ checked: "نشط", unchecked: "غير نشط" }}
    className={className}
    {...props}
  />
))
DangerSwitch.displayName = "DangerSwitch"

// Switch Group Component
const SwitchGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: "vertical" | "horizontal"
  }
>(({ className, direction = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "space-y-4",
      direction === "horizontal" && "flex flex-wrap items-center gap-6 space-y-0",
      className
    )}
    {...props}
  />
))
SwitchGroup.displayName = "SwitchGroup"

// Switch Item Component
const SwitchItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string
    description?: string
    switchProps?: React.ComponentPropsWithoutRef<typeof Switch>
  }
>(({ className, label, description, switchProps, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "flex items-start justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700",
      "bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300",
      "hover:border-blue-300 dark:hover:border-blue-600",
      className
    )}
    {...props}
  >
    <div className="flex-1 space-y-1">
      <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {children}
    </div>
    <Switch {...switchProps} />
  </motion.div>
))
SwitchItem.displayName = "SwitchItem"

export { 
  Switch, 
  ThemeSwitch, 
  NotificationSwitch, 
  DangerSwitch, 
  SwitchGroup, 
  SwitchItem 
}