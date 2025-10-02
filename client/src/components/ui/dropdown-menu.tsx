import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Check, 
  ChevronRight, 
  Circle, 
  Sparkles,
  Zap,
  Star,
  Shield,
  Crown,
  ArrowRight,
  Loader2
} from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const dropdownMenuContentVariants = cva(
  "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto overflow-x-hidden rounded-2xl border p-2 text-popover-foreground shadow-2xl backdrop-blur-lg transition-all duration-500 ease-silk origin-[--radix-dropdown-menu-content-transform-origin]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-popover border-border/50",
        glass: "glass-card border-white/20",
        elevated: "bg-popover border-border shadow-xl",
        premium: "bg-gradient-to-br from-popover to-popover/95 border-primary/20 shadow-glow"
      },
      size: {
        sm: "min-w-[10rem] text-sm",
        md: "min-w-[12rem] text-base",
        lg: "min-w-[16rem] text-lg",
        xl: "min-w-[20rem] text-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
  VariantProps<typeof dropdownMenuContentVariants> & {
    withArrow?: boolean
  }
>(({ className, variant, size, sideOffset = 8, withArrow = true, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(dropdownMenuContentVariants({ variant, size }), className)}
      {...props}
    >
      {props.children}
      {withArrow && (
        <DropdownMenuPrimitive.Arrow 
          className={cn(
            "fill-current",
            variant === "premium" ? "text-primary/20" : "text-popover"
          )} 
          width={12} 
          height={6} 
        />
      )}
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const dropdownMenuItemVariants = cva(
  "relative flex cursor-default select-none items-center gap-3 rounded-xl px-3 py-3 text-sm outline-none transition-all duration-300 ease-magnetic group",
  "focus:scale-105 focus:shadow-lg active:scale-95",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:scale-100",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-all [&_svg]:duration-300",
  {
    variants: {
      variant: {
        default: "focus:bg-accent focus:text-accent-foreground hover:bg-accent/80",
        glass: "focus:bg-white/10 focus:text-foreground hover:bg-white/5",
        elevated: "focus:bg-accent focus:text-accent-foreground hover:bg-accent/80 hover:shadow-md",
        premium: "focus:bg-primary/20 focus:text-primary hover:bg-primary/15"
      },
      size: {
        sm: "text-xs py-2 px-2 gap-2 [&_svg]:size-3",
        md: "text-sm py-3 px-3 gap-3 [&_svg]:size-4",
        lg: "text-base py-3 px-4 gap-3 [&_svg]:size-5",
        xl: "text-lg py-4 px-4 gap-4 [&_svg]:size-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & 
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean
    icon?: React.ReactNode
    loading?: boolean
    success?: boolean
    destructive?: boolean
  }
>(({ className, variant, size, inset, icon, loading, success, destructive, children, ...props }, ref) => {
  const [isSuccess, setIsSuccess] = React.useState(false)

  React.useEffect(() => {
    if (success) {
      setIsSuccess(true)
      const timer = setTimeout(() => setIsSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [success])

  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        dropdownMenuItemVariants({ variant, size }),
        inset && "pl-8",
        destructive && "text-destructive focus:text-destructive hover:text-destructive",
        "relative",
        className
      )}
      {...props}
    >
      {/* Background Hover Effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
        "group-hover:opacity-100 group-focus:opacity-100",
        destructive ? "bg-destructive/10" :
        variant === "premium" ? "bg-primary/10" :
        "bg-accent"
      )} />

      {/* Loading/Success States */}
      {(loading || isSuccess) && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : isSuccess ? (
            <Check className="size-3 text-success animate-in zoom-in-50" />
          ) : null}
        </div>
      )}

      {/* Icon */}
      {icon && !loading && !isSuccess && (
        <div className={cn(
          "relative z-10 transition-all duration-300",
          destructive ? "text-destructive" :
          variant === "premium" ? "text-primary" : "text-muted-foreground",
          "group-hover:scale-110 group-focus:scale-110"
        )}>
          {icon}
        </div>
      )}

      {/* Content */}
      <span className="relative z-10 flex-1 transition-all duration-300 group-hover:translate-x-1">
        {children}
      </span>

      {/* Success Overlay */}
      {isSuccess && (
        <div className="absolute inset-0 bg-success/10 rounded-xl" />
      )}
    </DropdownMenuPrimitive.Item>
  )
})
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> &
  VariantProps<typeof dropdownMenuItemVariants>
>(({ className, variant, size, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant, size }), "relative pl-10", className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className={cn(
          "size-4 animate-in zoom-in-50",
          variant === "premium" ? "text-primary" : ""
        )} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
      {children}
    </span>
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> &
  VariantProps<typeof dropdownMenuItemVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant, size }), "relative pl-10", className)}
    {...props}
  >
    <span className="absolute left-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className={cn(
          "size-2 fill-current animate-in zoom-in-50",
          variant === "premium" ? "text-primary" : ""
        )} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
      {children}
    </span>
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & 
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean
  }
>(({ className, variant, size, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      dropdownMenuItemVariants({ variant, size }),
      inset && "pl-8",
      className
    )}
    {...props}
  >
    <span className="relative z-10 flex-1 transition-all duration-300 group-hover:translate-x-1">
      {children}
    </span>
    <ChevronRight className={cn(
      "ml-auto size-4 transition-transform duration-300",
      "group-hover:translate-x-1 group-data-[state=open]:rotate-90"
    )} />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> &
  VariantProps<typeof dropdownMenuContentVariants>
>(({ className, variant, size, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(dropdownMenuContentVariants({ variant, size }), className)}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & 
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean
    withIcon?: boolean
    icon?: React.ReactNode
  }
>(({ className, variant, size, inset, withIcon, icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-3 text-sm font-semibold flex items-center gap-3",
      inset && "pl-8",
      variant === "premium" && "text-primary",
      className
    )}
    {...props}
  >
    {withIcon && icon && (
      <div className={cn(
        "p-1 rounded-lg",
        variant === "premium" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
    )}
    {children}
  </DropdownMenuPrimitive.Label>
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & {
    variant?: "default" | "gradient"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-2 my-2 h-px transition-all duration-300",
      variant === "default" ? "bg-border" : "bg-gradient-to-r from-transparent via-primary/30 to-transparent",
      className
    )}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "premium"
}) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest transition-all duration-300 group-hover:scale-110",
        variant === "premium" ? "text-primary/70" : "opacity-60",
        className
      )}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// Enhanced Dropdown Menu with quick actions
interface EnhancedDropdownMenuProps {
  trigger: React.ReactNode
  items: Array<{
    label: string
    icon?: React.ReactNode
    shortcut?: string
    onClick?: () => void
    variant?: "default" | "destructive" | "premium"
    disabled?: boolean
    loading?: boolean
    success?: boolean
  }>
  variant?: VariantProps<typeof dropdownMenuContentVariants>["variant"]
  size?: VariantProps<typeof dropdownMenuContentVariants>["size"]
  align?: "start" | "center" | "end"
}

const EnhancedDropdownMenu: React.FC<EnhancedDropdownMenuProps> = ({
  trigger,
  items,
  variant = "default",
  size = "md",
  align = "start"
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent variant={variant} size={size} align={align}>
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            variant={variant}
            size={size}
            icon={item.icon}
            destructive={item.variant === "destructive"}
            loading={item.loading}
            success={item.success}
            disabled={item.disabled}
            onClick={item.onClick}
            className="animate-in fade-in-50 slide-in-from-top-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {item.label}
            {item.shortcut && (
              <DropdownMenuShortcut variant={variant}>
                {item.shortcut}
              </DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Premium Dropdown Menu Component
const PremiumDropdownMenu: React.FC<EnhancedDropdownMenuProps> = (props) => {
  return <EnhancedDropdownMenu {...props} variant="premium" />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  EnhancedDropdownMenu,
  PremiumDropdownMenu,
  dropdownMenuContentVariants,
  dropdownMenuItemVariants
}