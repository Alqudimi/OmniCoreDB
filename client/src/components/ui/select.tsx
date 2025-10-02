"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, Search, AlertCircle, LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

// Types
interface SelectProps {
  variant?: "default" | "outline" | "filled" | "ghost"
  size?: "sm" | "md" | "lg"
  status?: "default" | "error" | "success" | "warning"
  searchable?: boolean
  showChevron?: boolean
}

// Main Components
const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

// Select Trigger
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & SelectProps
>(({ 
  className, 
  children, 
  variant = "default",
  size = "md",
  status = "default",
  showChevron = true,
  ...props 
}, ref) => {
  const variants = {
    default: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400",
    outline: "border-2 border-gray-200 dark:border-gray-700 bg-transparent hover:border-gray-300",
    filled: "border-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600",
    ghost: "border-0 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700"
  }

  const sizes = {
    sm: "h-8 px-2 text-xs rounded-md",
    md: "h-10 px-3 text-sm rounded-lg",
    lg: "h-12 px-4 text-base rounded-xl"
  }

  const statusStyles = {
    default: "",
    error: "border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 focus:ring-red-500",
    success: "border-green-500 dark:border-green-400 text-green-600 dark:text-green-400 focus:ring-green-500",
    warning: "border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 focus:ring-amber-500"
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between transition-all duration-300",
        "ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        "font-medium text-gray-900 dark:text-white",
        variants[variant],
        sizes[size],
        statusStyles[status],
        "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <motion.span 
        className="flex-1 text-left truncate"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      <div className="flex items-center gap-2 ml-2">
        {status !== "default" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AlertCircle className={cn(
              "h-3 w-3 flex-shrink-0",
              status === "error" && "text-red-500",
              status === "success" && "text-green-500",
              status === "warning" && "text-amber-500"
            )} />
          </motion.div>
        )}
        
        {showChevron && (
          <SelectPrimitive.Icon asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ChevronDown className={cn(
                "h-4 w-4 opacity-70 transition-transform duration-300",
                "group-data-[state=open]:rotate-180"
              )} />
            </motion.div>
          </SelectPrimitive.Icon>
        )}
      </div>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// Select Content
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    animated?: boolean
    searchable?: boolean
    onSearch?: (value: string) => void
  }
>(({ 
  className, 
  children, 
  position = "popper", 
  animated = true,
  searchable = false,
  onSearch,
  ...props 
}, ref) => {
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl",
          "backdrop-blur-xl bg-white/95 dark:bg-gray-900/95",
          "border-gray-200/50 dark:border-gray-700/50",
          animated && [
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          ],
          position === "popper" && [
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1",
            "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
          ],
          "origin-[--radix-select-content-transform-origin] transition-all duration-300",
          className
        )}
        position={position}
        {...props}
      >
        {searchable && (
          <div className="sticky top-0 z-10 p-2 bg-inherit border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-2",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

// Select Item
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    icon?: LucideIcon
    description?: string
    badge?: string
  }
>(({ className, children, icon: Icon, description, badge, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center gap-3 rounded-lg py-2.5 pl-8 pr-3",
      "text-sm outline-none transition-all duration-200",
      "focus:bg-gradient-to-r focus:from-blue-50 focus:to-blue-100 focus:text-blue-700",
      "focus:dark:from-blue-900/30 focus:dark:to-blue-800/30 focus:dark:text-blue-300",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
      "border border-transparent hover:border-blue-200 dark:hover:border-blue-800",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </SelectPrimitive.ItemIndicator>
    </span>

    <div className="flex items-center gap-2 flex-1 min-w-0">
      {Icon && (
        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <SelectPrimitive.ItemText className="font-medium text-gray-900 dark:text-white truncate">
          {children}
        </SelectPrimitive.ItemText>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      {badge && (
        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full font-medium flex-shrink-0">
          {badge}
        </span>
      )}
    </div>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// Select Label
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
    icon?: LucideIcon
  }
>(({ className, icon: Icon, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "flex items-center gap-2 py-3 px-3 text-xs font-bold uppercase tracking-wide",
      "text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800",
      "bg-gray-50 dark:bg-gray-800/50 rounded-t-lg",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-3.5 w-3.5" />}
    {props.children}
  </SelectPrimitive.Label>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// Select Separator
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-2 my-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent",
      "dark:via-gray-700 transition-all duration-300",
      className
    )}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Scroll Buttons
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1.5",
      "bg-gradient-to-b from-white dark:from-gray-900 to-transparent",
      "sticky top-0 z-20 transition-all duration-300",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1.5",
      "bg-gradient-to-t from-white dark:from-gray-900 to-transparent",
      "sticky bottom-0 z-20 transition-all duration-300",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

// Enhanced Select Component
const EnhancedSelect = ({
  children,
  placeholder = "اختر خيار...",
  variant = "default",
  size = "md",
  status = "default",
  searchable = false,
  ...props
}: React.ComponentProps<typeof Select> & SelectProps & {
  placeholder?: string
}) => (
  <Select {...props}>
    <SelectTrigger variant={variant} size={size} status={status}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent searchable={searchable}>
      {children}
    </SelectContent>
  </Select>
)

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  EnhancedSelect,
}