import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Types
interface TabsProps {
  variant?: "default" | "underline" | "pills" | "segmented" | "glass"
  size?: "sm" | "md" | "lg"
  color?: "blue" | "green" | "purple" | "orange" | "red" | "gray"
  orientation?: "horizontal" | "vertical"
  fullWidth?: boolean
  animated?: boolean
  showIndicator?: boolean
}

const TabsContext = React.createContext<TabsProps>({
  variant: "default",
  size: "md",
  color: "blue",
  orientation: "horizontal",
  fullWidth: false,
  animated: true,
  showIndicator: true,
})

// Main Tabs Component
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & TabsProps
>(({ 
  className, 
  variant = "default",
  size = "md",
  color = "blue",
  orientation = "horizontal",
  fullWidth = false,
  animated = true,
  showIndicator = true,
  ...props 
}, ref) => (
  <TabsContext.Provider value={{ 
    variant, 
    size, 
    color, 
    orientation, 
    fullWidth, 
    animated, 
    showIndicator 
  }}>
    <TabsPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        "w-full transition-all duration-300",
        orientation === "vertical" && "flex gap-6",
        className
      )}
      {...props}
    />
  </TabsContext.Provider>
))
Tabs.displayName = TabsPrimitive.Root.displayName

// TabsList Component
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    centered?: boolean
  }
>(({ className, centered = false, ...props }, ref) => {
  const context = React.useContext(TabsContext)

  const variants = {
    default: "bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5",
    underline: "bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none p-0 gap-0",
    pills: "bg-transparent gap-2 p-0",
    segmented: "bg-gray-100 dark:bg-gray-800 rounded-xl p-1",
    glass: "backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-2xl p-1.5"
  }

  const sizes = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base"
  }

  const orientationStyles = {
    horizontal: "flex-row",
    vertical: "flex-col w-auto items-stretch"
  }

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-300",
        variants[context.variant!],
        sizes[context.size!],
        orientationStyles[context.orientation!],
        context.fullWidth && "w-full",
        centered && "mx-auto",
        context.variant === "underline" && "min-h-12",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

// TabsTrigger Component
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    icon?: LucideIcon
    badge?: string | number
    showIconOnly?: boolean
  }
>(({ className, icon: Icon, badge, showIconOnly = false, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)

  const colors = {
    blue: {
      active: "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
      inactive: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    },
    green: {
      active: "bg-green-500 text-white shadow-lg shadow-green-500/25",
      inactive: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    },
    purple: {
      active: "bg-purple-500 text-white shadow-lg shadow-purple-500/25",
      inactive: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    },
    orange: {
      active: "bg-orange-500 text-white shadow-lg shadow-orange-500/25",
      inactive: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    },
    red: {
      active: "bg-red-500 text-white shadow-lg shadow-red-500/25",
      inactive: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    },
    gray: {
      active: "bg-gray-500 text-white shadow-lg shadow-gray-500/25",
      inactive: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    }
  }

  const variantStyles = {
    default: cn(
      "rounded-xl transition-all duration-300",
      "data-[state=active]:shadow-md data-[state=active]:scale-105",
      "hover:scale-105 hover:bg-white/50 dark:hover:bg-gray-700/50"
    ),
    underline: cn(
      "rounded-none border-b-2 border-transparent px-4 py-3 transition-colors duration-300",
      "data-[state=active]:border-current data-[state=active]:text-current",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      "relative min-w-20"
    ),
    pills: cn(
      "rounded-full px-6 transition-all duration-300",
      "data-[state=active]:shadow-md data-[state=active]:scale-105",
      "hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
    ),
    segmented: cn(
      "rounded-lg transition-all duration-300",
      "data-[state=active]:shadow-md",
      "hover:bg-white/50 dark:hover:bg-gray-700/50"
    ),
    glass: cn(
      "rounded-xl backdrop-blur-sm transition-all duration-300",
      "data-[state=active]:shadow-lg data-[state=active]:scale-105",
      "hover:scale-105 hover:bg-white/30 dark:hover:bg-gray-700/30"
    )
  }

  const sizesStyles = {
    sm: "px-3 py-1.5 gap-1.5",
    md: "px-4 py-2 gap-2",
    lg: "px-6 py-3 gap-3"
  }

  const isActive = props['data-state'] === 'active'

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap font-medium",
        "ring-offset-background transition-all duration-300 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        context.fullWidth && "flex-1",
        variantStyles[context.variant!],
        sizesStyles[context.size!],
        isActive ? colors[context.color!].active : colors[context.color!].inactive,
        showIconOnly && "aspect-square",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "flex items-center gap-2 transition-all duration-300",
          showIconOnly && "flex-col gap-1"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {Icon && (
          <Icon className={cn(
            "flex-shrink-0 transition-colors duration-300",
            context.size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
            showIconOnly && context.size === "lg" && "h-5 w-5"
          )} />
        )}
        
        {!showIconOnly && (
          <span className="font-medium">{children}</span>
        )}

        {badge && (
          <span className={cn(
            "px-1.5 py-0.5 text-xs rounded-full font-medium transition-colors duration-300",
            isActive 
              ? "bg-white/20 text-white" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          )}>
            {badge}
          </span>
        )}
      </motion.div>

      {context.variant === "underline" && context.showIndicator && isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
          layoutId="activeTabIndicator"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// TabsContent Component
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    animated?: boolean
  }
>(({ className, animated = true, ...props }, ref) => {
  const context = React.useContext(TabsContext)

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-300",
        context.orientation === "horizontal" ? "mt-4" : "ml-4",
        className
      )}
      {...props}
    >
      {animated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {props.children}
        </motion.div>
      ) : (
        props.children
      )}
    </TabsPrimitive.Content>
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

// Enhanced Tabs Components

// IconTabs Component
const IconTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs> & {
    items: Array<{ value: string; icon: LucideIcon; label: string; badge?: string }>
  }
>(({ items, className, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="pills"
    className={className}
    {...props}
  >
    <TabsList className="mx-auto">
      {items.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          icon={item.icon}
          badge={item.badge}
          showIconOnly
          className="flex-col gap-1"
        >
          <span className="text-xs">{item.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
))
IconTabs.displayName = "IconTabs"

// SegmentedTabs Component
const SegmentedTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs> & {
    items: Array<{ value: string; label: string; badge?: string }>
  }
>(({ items, className, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="segmented"
    fullWidth
    className={className}
    {...props}
  >
    <TabsList>
      {items.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          badge={item.badge}
          className="flex-1"
        >
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
))
SegmentedTabs.displayName = "SegmentedTabs"

// VerticalTabs Component
const VerticalTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentPropsWithoutRef<typeof Tabs> & {
    items: Array<{ value: string; label: string; icon?: LucideIcon }>
  }
>(({ items, className, ...props }, ref) => (
  <Tabs
    ref={ref}
    orientation="vertical"
    variant="pills"
    className={cn("min-h-96", className)}
    {...props}
  >
    <div className="flex gap-8">
      <TabsList className="w-48">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            icon={item.icon}
            className="w-full justify-start"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="flex-1">
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {props.children}
          </TabsContent>
        ))}
      </div>
    </div>
  </Tabs>
))
VerticalTabs.displayName = "VerticalTabs"

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  IconTabs,
  SegmentedTabs,
  VerticalTabs
}