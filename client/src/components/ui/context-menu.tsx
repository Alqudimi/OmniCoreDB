import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { 
  Check, 
  ChevronRight, 
  Circle, 
  Minus,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Share,
  Edit,
  Trash2,
  Folder,
  File
} from "lucide-react"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
    icon?: React.ReactNode
  }
>(({ className, inset, icon, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200",
      "focus:bg-gradient-to-r focus:from-primary/10 focus:to-primary/5 focus:text-foreground",
      "data-[state=open]:bg-gradient-to-r data-[state=open]:from-primary/15 data-[state=open]:to-primary/10 data-[state=open]:text-foreground",
      "hover:bg-accent/50 hover:shadow-sm hover:scale-105",
      "active:scale-95",
      "border border-transparent hover:border-border/30",
      inset && "pl-10",
      className
    )}
    {...props}
  >
    {icon && (
      <div className="flex items-center justify-center w-5 h-5">
        {icon}
      </div>
    )}
    <span className="flex-1">{children}</span>
    <ChevronRight className="ml-2 h-4 w-4 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-90" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[10rem] overflow-hidden rounded-xl border bg-popover/95 backdrop-blur-xl p-2 text-popover-foreground shadow-2xl",
      "animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-3 data-[side=left]:slide-in-from-right-3",
      "data-[side=right]:slide-in-from-left-3 data-[side=top]:slide-in-from-bottom-3",
      "border-border/50 shadow-2xl",
      "origin-[--radix-context-menu-content-transform-origin]",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-[var(--radix-context-menu-content-available-height)] min-w-[12rem] overflow-y-auto overflow-x-hidden rounded-xl bg-popover/95 backdrop-blur-xl p-2 text-popover-foreground shadow-2xl",
        "animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-3 data-[side=left]:slide-in-from-right-3",
        "data-[side=right]:slide-in-from-left-3 data-[side=top]:slide-in-from-bottom-3",
        "border border-border/50",
        "custom-scrollbar",
        "origin-[--radix-context-menu-content-transform-origin]",
        "transition-all duration-300 ease-out",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
    icon?: React.ReactNode
    variant?: "default" | "destructive" | "premium"
  }
>(({ className, inset, icon, variant = "default", children, ...props }, ref) => {
  const variantStyles = {
    default: "focus:bg-accent focus:text-foreground",
    destructive: "focus:bg-destructive/15 focus:text-destructive data-[disabled]:opacity-30",
    premium: "focus:bg-gradient-to-r focus:from-amber-500/10 focus:to-orange-500/10 focus:text-amber-600"
  }

  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200",
        "hover:shadow-sm hover:scale-105 active:scale-95",
        "border border-transparent hover:border-border/20",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:grayscale",
        variantStyles[variant],
        inset && "pl-10",
        className
      )}
      {...props}
    >
      {icon && (
        <div className={cn(
          "flex items-center justify-center w-5 h-5 transition-transform duration-200",
          variant === "destructive" && "text-destructive",
          variant === "premium" && "text-amber-500"
        )}>
          {icon}
        </div>
      )}
      <span className="flex-1">{children}</span>
    </ContextMenuPrimitive.Item>
  )
})
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
    icon?: React.ReactNode
  }
>(({ className, children, checked, icon, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-3 rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-200",
      "focus:bg-accent focus:text-foreground",
      "hover:bg-accent/50 hover:shadow-sm hover:scale-105",
      "active:scale-95",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "border border-transparent hover:border-border/20",
      className
    )}
    checked={checked}
    {...props}
  >
    {icon && (
      <div className="absolute left-3 flex items-center justify-center w-5 h-5">
        {icon}
      </div>
    )}
    <span className={cn(
      "absolute left-3 flex h-3.5 w-3.5 items-center justify-center rounded-md border border-primary transition-all duration-200",
      checked && "bg-primary text-primary-foreground scale-110 shadow-sm"
    )}>
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-3 w-3" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    <span className="flex-1 ml-6">{children}</span>
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
    icon?: React.ReactNode
  }
>(({ className, children, icon, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-3 rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-200",
      "focus:bg-accent focus:text-foreground",
      "hover:bg-accent/50 hover:shadow-sm hover:scale-105",
      "active:scale-95",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "border border-transparent hover:border-border/20",
      className
    )}
    {...props}
  >
    {icon && (
      <div className="absolute left-3 flex items-center justify-center w-5 h-5">
        {icon}
      </div>
    )}
    <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-3 w-3 fill-current text-primary animate-pulse" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    <span className="flex-1 ml-6">{children}</span>
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
    withDivider?: boolean
  }
>(({ className, inset, withDivider = true, ...props }, ref) => (
  <>
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/70",
        "flex items-center gap-2",
        withDivider && "border-b border-border/30 mb-1",
        inset && "pl-10",
        className
      )}
      {...props}
    />
    {withDivider && <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-1" />}
  </>
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> & {
    decorative?: boolean
  }
>(({ className, decorative = true, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-2 my-2 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "premium"
}) => {
  const variantStyles = {
    default: "text-muted-foreground/60",
    premium: "text-amber-500/80"
  }

  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest transition-all duration-200",
        "px-2 py-1 rounded-md bg-muted/50 border border-border/30",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

const ContextMenuIcon = ({
  icon,
  className,
  variant = "default"
}: {
  icon: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "premium"
}) => {
  const variantStyles = {
    default: "text-muted-foreground",
    destructive: "text-destructive",
    premium: "text-amber-500"
  }

  return (
    <div className={cn(
      "flex items-center justify-center w-5 h-5 transition-all duration-200",
      variantStyles[variant],
      className
    )}>
      {icon}
    </div>
  )
}

// مكونات مساعدة مسبقة التعريف
const ContextMenuActionItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    action: "copy" | "cut" | "paste" | "share" | "download" | "edit" | "delete"
    label: string
    shortcut?: string
  }
>(({ action, label, shortcut, ...props }, ref) => {
  const actionIcons = {
    copy: <Copy className="w-4 h-4" />,
    cut: <Minus className="w-4 h-4" />,
    paste: <File className="w-4 h-4" />,
    share: <Share className="w-4 h-4" />,
    download: <Download className="w-4 h-4" />,
    edit: <Edit className="w-4 h-4" />,
    delete: <Trash2 className="w-4 h-4" />
  }

  const variant = action === "delete" ? "destructive" : "default"

  return (
    <ContextMenuItem
      ref={ref}
      icon={actionIcons[action]}
      variant={variant}
      {...props}
    >
      {label}
      {shortcut && <ContextMenuShortcut variant={action === "delete" ? "default" : variant}>{shortcut}</ContextMenuShortcut>}
    </ContextMenuItem>
  )
})
ContextMenuActionItem.displayName = "ContextMenuActionItem"

// أنماط CSS مخصصة للشريط التمرير
const ContextMenuStyles = () => (
  <style jsx global>{`
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: hsl(var(--border)) transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 10px;
      margin: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: hsl(var(--border));
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--muted-foreground));
    }
  `}</style>
)

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuIcon,
  ContextMenuActionItem,
  ContextMenuStyles,
}