"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle, LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

// Types
interface MenuItemProps {
  icon?: LucideIcon
  badge?: string
  variant?: "default" | "destructive" | "success"
}

// Menu Components
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return (
    <MenubarPrimitive.Sub 
      data-slot="menubar-sub" 
      {...props} 
    />
  )
}

// Main Menubar Component
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> & {
    variant?: "default" | "solid" | "ghost"
    size?: "sm" | "md" | "lg"
  }
>(({ className, variant = "default", size = "md", ...props }, ref) => {
  const variants = {
    default: "bg-background/80 backdrop-blur-sm border border-gray-200/50 shadow-sm",
    solid: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md",
    ghost: "bg-transparent border-none shadow-none"
  }

  const sizes = {
    sm: "h-8 gap-1 text-xs",
    md: "h-10 gap-2 text-sm",
    lg: "h-12 gap-3 text-base"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MenubarPrimitive.Root
        ref={ref}
        className={cn(
          "flex items-center rounded-xl transition-all duration-300",
          "hover:shadow-lg hover:border-gray-300/50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    </motion.div>
  )
})
Menubar.displayName = MenubarPrimitive.Root.displayName

// Menubar Trigger Component
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> & {
    active?: boolean
  }
>(({ className, active, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-4 py-2 font-medium outline-none",
      "transition-all duration-200 transform hover:scale-105",
      "focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 focus:text-blue-700",
      "focus:dark:from-blue-950/30 focus:dark:to-purple-950/30 focus:dark:text-blue-300",
      "data-[state=open]:bg-gradient-to-r data-[state=open]:from-blue-50 data-[state=open]:to-purple-50",
      "data-[state=open]:text-blue-700 data-[state=open]:shadow-md",
      "data-[state=open]:dark:from-blue-950/30 data-[state=open]:dark:to-purple-950/30",
      "data-[state=open]:dark:text-blue-300",
      "hover:bg-gray-50/80 hover:dark:bg-gray-800/50",
      active && "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

// Menubar Content Component
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> & {
    animated?: boolean
  }
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, animated = true, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[14rem] overflow-hidden rounded-2xl border bg-popover/95 backdrop-blur-xl",
          "p-2 text-popover-foreground shadow-2xl shadow-black/10",
          "border-gray-200/50 dark:border-gray-700/50",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "origin-[--radix-menubar-content-transform-origin]",
          "transition-all duration-300",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

// Menubar Item Component
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & 
  MenuItemProps & {
    inset?: boolean
    active?: boolean
  }
>(({ className, inset, icon: Icon, badge, variant = "default", active, children, ...props }, ref) => {
  const variantStyles = {
    default: "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
    destructive: "focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/50 dark:focus:text-red-300 text-red-600 dark:text-red-400",
    success: "focus:bg-green-50 focus:text-green-700 dark:focus:bg-green-950/50 dark:focus:text-green-300 text-green-600 dark:text-green-400"
  }

  return (
    <MenubarPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5",
        "text-sm outline-none transition-all duration-200",
        "hover:scale-105 hover:shadow-md active:scale-95",
        variantStyles[variant],
        active && "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon className={cn(
          "h-4 w-4 flex-shrink-0 transition-transform duration-200",
          active && "scale-110"
        )} />
      )}
      <span className="flex-1">{children}</span>
      {badge && (
        <span className={cn(
          "px-2 py-1 text-xs rounded-full font-medium transition-all duration-200",
          variant === "destructive" 
            ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
            : variant === "success"
            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        )}>
          {badge}
        </span>
      )}
    </MenubarPrimitive.Item>
  )
})
MenubarItem.displayName = MenubarPrimitive.Item.displayName

// Menubar Sub Components
const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & 
  MenuItemProps & {
    inset?: boolean
  }
>(({ className, inset, icon: Icon, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5",
      "text-sm outline-none transition-all duration-200",
      "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
      "hover:scale-105 hover:shadow-md",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
    <span className="flex-1">{children}</span>
    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[10rem] overflow-hidden rounded-2xl border bg-popover/95 backdrop-blur-xl p-2",
      "text-popover-foreground shadow-2xl shadow-black/10",
      "border-gray-200/50 dark:border-gray-700/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "origin-[--radix-menubar-content-transform-origin] transition-all duration-300",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

// Checkbox and Radio Items
const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> & 
  MenuItemProps
>(({ className, children, checked, icon: Icon, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-3 rounded-lg py-2 pl-8 pr-3",
      "text-sm outline-none transition-all duration-200",
      "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
      "hover:scale-105 hover:shadow-md",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </MenubarPrimitive.ItemIndicator>
    </span>
    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> & 
  MenuItemProps
>(({ className, children, icon: Icon, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-3 rounded-lg py-2 pl-8 pr-3",
      "text-sm outline-none transition-all duration-200",
      "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-100",
      "hover:scale-105 hover:shadow-md",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Circle className="h-2 w-2 fill-current text-blue-600 dark:text-blue-400" />
        </motion.div>
      </MenubarPrimitive.ItemIndicator>
    </span>
    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

// Additional Components
const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400",
      "border-b border-gray-200/50 dark:border-gray-700/50 mb-1",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent",
      "dark:via-gray-700 transition-all duration-300",
      className
    )}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-gray-400 dark:text-gray-500",
        "transition-colors duration-200 group-hover:text-gray-600",
        "dark:group-hover:text-gray-400",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayName = "MenubarShortcut"

// New Component: MenubarGroup with Icon
const MenubarGroupWithIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon: LucideIcon
    title: string
  }
>(({ className, icon: Icon, title, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props}>
    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      <Icon className="h-3.5 w-3.5" />
      {title}
    </div>
    {children}
  </div>
))
MenubarGroupWithIcon.displayName = "MenubarGroupWithIcon"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
  MenubarGroupWithIcon,
}