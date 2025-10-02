import * as React from "react"
import { ChevronUp, ChevronDown, Filter, MoreHorizontal, Sparkles, ArrowUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    variant?: "default" | "elegant" | "modern" | "minimal" | "glass"
    size?: "sm" | "md" | "lg"
    striped?: boolean
    hoverable?: boolean
  }
>(({ className, variant = "default", size = "md", striped = true, hoverable = true, ...props }, ref) => {
  const tableVariants = {
    default: "bg-background border-border",
    elegant: "bg-background/95 backdrop-blur-sm border-border/50",
    modern: "bg-muted/20 border-muted-foreground/20",
    minimal: "bg-transparent border-border/30",
    glass: "bg-background/80 backdrop-blur-xl border-white/20"
  }

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn(
      "relative w-full overflow-auto rounded-2xl transition-all duration-300",
      "shadow-sm hover:shadow-md",
      tableVariants[variant],
      variant !== "minimal" && "border"
    )}>
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom transition-all duration-300",
          sizeStyles[size],
          striped && "[&_tbody_tr:nth-child(even)]:bg-muted/30",
          hoverable && "[&_tbody_tr]:transition-colors [&_tbody_tr]:duration-200",
          className
        )}
        {...props}
      />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    sticky?: boolean
    variant?: "default" | "gradient"
  }
>(({ className, sticky = false, variant = "default", ...props }, ref) => {
  const headerVariants = {
    default: "bg-muted/50",
    gradient: "bg-gradient-to-r from-muted/60 to-muted/30"
  }

  return (
    <thead 
      ref={ref} 
      className={cn(
        "[&_tr]:border-b transition-all duration-300",
        headerVariants[variant],
        sticky && "sticky top-0 z-10 backdrop-blur-sm",
        className
      )} 
      {...props} 
    />
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0 transition-all duration-300",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    variant?: "default" | "gradient"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const footerVariants = {
    default: "bg-muted/50",
    gradient: "bg-gradient-to-r from-muted/30 to-muted/60"
  }

  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t transition-all duration-300",
        "font-medium [&>tr]:last:border-b-0",
        footerVariants[variant],
        className
      )}
      {...props}
    />
  )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    clickable?: boolean
    selected?: boolean
    status?: "default" | "success" | "warning" | "error" | "info"
  }
>(({ className, clickable = false, selected = false, status = "default", ...props }, ref) => {
  const statusStyles = {
    default: "",
    success: "border-l-4 border-l-success hover:border-l-success/80",
    warning: "border-l-4 border-l-warning hover:border-l-warning/80",
    error: "border-l-4 border-l-destructive hover:border-l-destructive/80",
    info: "border-l-4 border-l-primary hover:border-l-primary/80"
  }

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-all duration-300",
        "hover:bg-muted/50",
        clickable && "cursor-pointer hover:scale-[1.01] hover:shadow-sm",
        selected && "bg-primary/10 border-primary/20",
        statusStyles[status],
        className
      )}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean
    sortDirection?: "asc" | "desc" | "none"
    onSort?: () => void
    filterable?: boolean
    onFilter?: () => void
  }
>(({ 
  className, 
  sortable = false, 
  sortDirection = "none",
  onSort,
  filterable = false,
  onFilter,
  children,
  ...props 
}, ref) => {
  const SortIcon = {
    asc: ChevronUp,
    desc: ChevronDown,
    none: ArrowUpDown
  }

  const IconComponent = SortIcon[sortDirection]

  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground transition-all duration-300",
        "group relative",
        sortable && "cursor-pointer hover:bg-muted/30",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          "transition-all duration-300",
          sortable && "group-hover:text-foreground"
        )}>
          {children}
        </span>
        
        {/* Sort Icon */}
        {sortable && (
          <div className={cn(
            "flex flex-col items-center justify-center transition-all duration-300",
            sortDirection !== "none" && "text-primary"
          )}>
            <IconComponent className="h-3 w-3" />
          </div>
        )}

        {/* Filter Icon */}
        {filterable && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:bg-primary/10 hover:text-primary"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onFilter?.()
            }}
          >
            <Filter className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Sort indicator bar */}
      {sortDirection !== "none" && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/60 transition-all duration-300" />
      )}
    </th>
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    variant?: "default" | "numeric" | "action" | "status"
    align?: "left" | "center" | "right"
  }
>(({ className, variant = "default", align = "left", ...props }, ref) => {
  const variantStyles = {
    default: "text-foreground",
    numeric: "font-mono text-right",
    action: "text-center",
    status: "text-center font-medium"
  }

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }

  return (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle transition-all duration-300",
        "group relative",
        variantStyles[variant],
        alignStyles[align],
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement> & {
    variant?: "default" | "elegant"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const captionVariants = {
    default: "text-muted-foreground",
    elegant: "text-foreground/80 bg-gradient-to-r from-transparent via-muted/30 to-transparent py-2"
  }

  return (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-sm transition-all duration-300",
        captionVariants[variant],
        className
      )}
      {...props}
    />
  )
})
TableCaption.displayName = "TableCaption"

// مكونات إضافية محسنة

const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "card" | "glass"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const containerVariants = {
    default: "bg-background border-border",
    card: "bg-card border-border rounded-2xl shadow-lg",
    glass: "bg-background/80 backdrop-blur-xl border-white/20 rounded-2xl shadow-2xl"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full transition-all duration-300",
        containerVariants[variant],
        variant !== "default" && "border p-6",
        className
      )}
      {...props}
    />
  )
})
TableContainer.displayName = "TableContainer"

const TableActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    position?: "top" | "bottom" | "both"
  }
>(({ className, position = "top", children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-4 transition-all duration-300",
      "bg-muted/30 border-border",
      position === "top" && "border-b rounded-t-2xl",
      position === "bottom" && "border-t rounded-b-2xl",
      position === "both" && "border-y",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
TableActions.displayName = "TableActions"

const TableEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode
    title?: string
    description?: string
  }
>(({ className, icon, title = "No data found", description, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center transition-all duration-300",
      "bg-muted/10 rounded-lg",
      className
    )}
    {...props}
  >
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4 transition-all duration-300 hover:scale-110">
      {icon || <Sparkles className="h-8 w-8 text-muted-foreground/60" />}
    </div>
    <h3 className="text-lg font-semibold mb-2 transition-colors duration-300">{title}</h3>
    {description && (
      <p className="text-sm text-muted-foreground max-w-sm transition-colors duration-300">
        {description}
      </p>
    )}
  </div>
))
TableEmpty.displayName = "TableEmpty"

const TableLoading = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    rows?: number
    columns?: number
  }
>(({ className, rows = 5, columns = 4, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex} className="animate-pulse">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <div className="h-4 bg-muted/50 rounded transition-all duration-300" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </tbody>
))
TableLoading.displayName = "TableLoading"

// أنماط CSS مخصصة
const TableStyles = () => (
  <style jsx global>{`
    @keyframes table-row-highlight {
      0% { background-color: hsl(var(--primary) / 0.1); }
      100% { background-color: transparent; }
    }
    
    .table-row-highlight {
      animation: table-row-highlight 2s ease-in-out;
    }
    
    /* تحسينات شريط التمرير للجدول */
    .table-scrollbar::-webkit-scrollbar {
      height: 8px;
      width: 8px;
    }
    
    .table-scrollbar::-webkit-scrollbar-track {
      background: hsl(var(--muted));
      border-radius: 4px;
    }
    
    .table-scrollbar::-webkit-scrollbar-thumb {
      background: hsl(var(--muted-foreground) / 0.3);
      border-radius: 4px;
    }
    
    .table-scrollbar::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--muted-foreground) / 0.5);
    }
  `}</style>
)

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableContainer,
  TableActions,
  TableEmpty,
  TableLoading,
  TableStyles,
}