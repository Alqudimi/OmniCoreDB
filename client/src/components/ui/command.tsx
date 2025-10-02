import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search, Command as CommandIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-popover/95 backdrop-blur-sm text-popover-foreground shadow-2xl border border-border/50",
      "transition-all duration-200 ease-in-out",
      "hover:shadow-3xl hover:border-border/70",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl border-0 max-w-2xl mx-4 sm:mx-auto">
        <Command className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground/80 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-2 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-14 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-border/30 px-4 bg-gradient-to-r from-background/50 to-background/30" cmdk-input-wrapper="">
    <div className="flex items-center gap-2 flex-1">
      <Search className="h-4 w-4 shrink-0 opacity-60 text-muted-foreground" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-md bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          "focus:ring-0 focus:outline-none",
          className
        )}
        {...props}
      />
    </div>
    <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-lg border border-border/30">
      <CommandIcon className="h-3 w-3 opacity-60" />
      <kbd className="text-xs font-mono text-muted-foreground/70">K</kbd>
    </div>
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[min(400px,60vh)] overflow-y-auto overflow-x-hidden custom-scrollbar p-2",
      "transition-all duration-300 ease-in-out",
      className
    )}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-8 text-center text-sm text-muted-foreground/80"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-2 text-foreground rounded-lg",
      "transition-all duration-200 ease-in-out",
      "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground/80 [&_[cmdk-group-heading]]:bg-muted/30 [&_[cmdk-group-heading]]:rounded-md [&_[cmdk-group-heading]]:mb-2",
      "hover:bg-accent/5",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-2 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-2",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-3 select-none items-center rounded-xl px-3 py-3 text-sm outline-none",
      "transition-all duration-200 ease-in-out transform",
      "data-[disabled=true]:pointer-events-none data-[selected='true']:bg-gradient-to-r data-[selected=true]:from-accent data-[selected=true]:to-accent/80 data-[selected=true]:text-accent-foreground data-[selected=true]:shadow-lg data-[selected=true]:scale-[1.02] data-[selected=true]:border data-[selected=true]:border-accent/30",
      "data-[disabled=true]:opacity-40 data-[disabled=true]:grayscale",
      "hover:bg-accent/10 hover:shadow-md active:scale-[0.98]",
      "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200",
      "data-[selected=true]_[&_svg]:scale-110 data-[selected=true]_[&_svg]:text-accent-foreground",
      "group",
      className
    )}
    {...props}
  >
    {children}
  </CommandPrimitive.Item>
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground/70 bg-muted/50 px-2 py-1 rounded-md border border-border/30",
        "transition-all duration-200",
        "group-data-[selected=true]:text-accent-foreground/80 group-data-[selected=true]:bg-accent/20 group-data-[selected=true]:border-accent/30",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

// إضافة أنماط CSS مخصصة للشريط التمرير
const CustomScrollbarStyles = () => (
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
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: hsl(var(--border));
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--muted-foreground));
    }
    
    @media (max-width: 640px) {
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
    }
  `}</style>
)

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CustomScrollbarStyles,
}