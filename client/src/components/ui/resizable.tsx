"use client"

import { GripVertical, GripHorizontal, Minus, Plus, RotateCcw } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import { createContext, useContext, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

// أنواع الأحجام والأنماط
type ResizableVariant = "default" | "minimal" | "elegant" | "modern" | "invisible"
type ResizableHandleStyle = "default" | "dot" | "line" | "dashed" | "gradient"

interface ResizableContextType {
  direction: "horizontal" | "vertical"
  variant: ResizableVariant
  registerPanel: (id: string, defaultSize: number) => void
  getPanelSize: (id: string) => number
  resetToDefault: (panelId?: string) => void
}

const ResizableContext = createContext<ResizableContextType | undefined>(undefined)

const useResizable = () => {
  const context = useContext(ResizableContext)
  if (!context) {
    throw new Error("useResizable must be used within a ResizablePanelGroup")
  }
  return context
}

interface ResizablePanelGroupProps 
  extends React.ComponentProps<typeof ResizablePrimitive.PanelGroup> {
  variant?: ResizableVariant
  showControls?: boolean
  storageKey?: string
  onLayoutChange?: (sizes: number[]) => void
}

const ResizablePanelGroup = ({
  className,
  variant = "default",
  showControls = false,
  storageKey,
  onLayoutChange,
  children,
  ...props
}: ResizablePanelGroupProps) => {
  const [panelSizes, setPanelSizes] = useState<Record<string, number>>({})
  const [panelIds, setPanelIds] = useState<string[]>([])

  const direction = props.direction || "horizontal"

  const registerPanel = (id: string, defaultSize: number) => {
    setPanelIds(prev => [...prev, id])
    setPanelSizes(prev => ({ ...prev, [id]: defaultSize }))
  }

  const getPanelSize = (id: string) => {
    return panelSizes[id] || 0
  }

  const resetToDefault = (panelId?: string) => {
    // Reset all panels or specific panel to default sizes
    // This would need to be implemented based on your default sizes logic
    console.log("Reset panels:", panelId || "all")
  }

  // Load saved layout from localStorage
  useEffect(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const savedSizes = JSON.parse(saved)
          setPanelSizes(savedSizes)
        }
      } catch (error) {
        console.warn("Failed to load resizable layout:", error)
      }
    }
  }, [storageKey])

  // Save layout to localStorage
  const saveLayout = (sizes: number[]) => {
    if (storageKey && panelIds.length === sizes.length) {
      try {
        const layout: Record<string, number> = {}
        panelIds.forEach((id, index) => {
          layout[id] = sizes[index]
        })
        localStorage.setItem(storageKey, JSON.stringify(layout))
      } catch (error) {
        console.warn("Failed to save resizable layout:", error)
      }
    }
  }

  const handleLayoutChange = (sizes: number[]) => {
    onLayoutChange?.(sizes)
    saveLayout(sizes)
  }

  const variantClasses = {
    default: "bg-background",
    minimal: "bg-transparent",
    elegant: "bg-background/50 backdrop-blur-sm rounded-lg p-2",
    modern: "bg-gradient-to-br from-background to-muted/20 rounded-xl p-1",
    invisible: "bg-transparent",
  }

  return (
    <ResizableContext.Provider value={{
      direction,
      variant,
      registerPanel,
      getPanelSize,
      resetToDefault,
    }}>
      <div className={cn(
        "relative group/resizable",
        showControls && "pb-8"
      )}>
        <ResizablePrimitive.PanelGroup
          className={cn(
            "flex h-full w-full data-[panel-group-direction=vertical]:flex-col transition-all duration-200",
            variantClasses[variant],
            className
          )}
          onLayout={handleLayoutChange}
          {...props}
        >
          {children}
        </ResizablePrimitive.PanelGroup>

        {/* Controls */}
        {showControls && (
          <div className={cn(
            "absolute bottom-2 left-1/2 transform -translate-x-1/2",
            "flex items-center gap-1 p-1 bg-background/80 backdrop-blur-sm",
            "rounded-lg border shadow-lg opacity-0 group-hover/resizable:opacity-100",
            "transition-opacity duration-300"
          )}>
            <button
              onClick={() => resetToDefault()}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              title="Reset to default layout"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              title="Collapse all"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              title="Expand all"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </ResizableContext.Provider>
  )
}

interface ResizablePanelProps 
  extends React.ComponentProps<typeof ResizablePrimitive.Panel> {
  panelId?: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  className?: string
}

const ResizablePanel = ({
  panelId,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  collapsible = true,
  className,
  children,
  ...props
}: ResizablePanelProps) => {
  const { registerPanel, variant } = useResizable()

  useEffect(() => {
    if (panelId) {
      registerPanel(panelId, defaultSize)
    }
  }, [panelId, defaultSize, registerPanel])

  const variantClasses = {
    default: "bg-background rounded-lg border",
    minimal: "bg-transparent",
    elegant: "bg-background/80 backdrop-blur-sm rounded-lg border border-border/50",
    modern: "bg-background rounded-lg border border-border/30 shadow-sm",
    invisible: "bg-transparent",
  }

  return (
    <ResizablePrimitive.Panel
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible={collapsible}
      className={cn(
        "transition-all duration-200",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </ResizablePrimitive.Panel>
  )
}

interface ResizableHandleProps 
  extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
  withHandle?: boolean
  handleStyle?: ResizableHandleStyle
  showTooltip?: boolean
  tooltipText?: string
}

const ResizableHandle = ({
  withHandle = true,
  handleStyle = "default",
  showTooltip = false,
  tooltipText,
  className,
  ...props
}: ResizableHandleProps) => {
  const { direction, variant } = useResizable()

  const handleClasses = {
    default: "bg-border hover:bg-primary/50",
    dot: "bg-transparent hover:bg-primary/20",
    line: "bg-primary/50 hover:bg-primary",
    dashed: "bg-transparent border border-dashed border-border hover:border-primary",
    gradient: "bg-gradient-to-r from-primary/50 to-primary/30 hover:from-primary hover:to-primary/70",
  }

  const handleIcons = {
    default: direction === "horizontal" ? <GripVertical className="h-3 w-3" /> : <GripHorizontal className="h-3 w-3" />,
    dot: <div className="h-1.5 w-1.5 rounded-full bg-current" />,
    line: null,
    dashed: null,
    gradient: direction === "horizontal" ? <GripVertical className="h-3 w-3" /> : <GripHorizontal className="h-3 w-3" />,
  }

  const getHandleContent = () => {
    if (!withHandle) return null

    return (
      <div className={cn(
        "flex items-center justify-center rounded-sm transition-all duration-200",
        "border bg-background shadow-sm hover:shadow-md",
        "hover:scale-110 hover:border-primary/50 hover:bg-accent",
        handleStyle === "line" && "w-1 h-8 border-0",
        handleStyle === "dashed" && "border-dashed bg-transparent",
        handleStyle === "gradient" && "border-0 bg-gradient-to-r from-primary to-primary/70",
        direction === "vertical" && "rotate-90"
      )}>
        {handleIcons[handleStyle]}
      </div>
    )
  }

  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex items-center justify-center transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[resize-handle-state=drag]:bg-primary/20 data-[resize-handle-state=drag]:shadow-lg",
        "group/handle",
        
        // Horizontal handle
        direction === "horizontal" && [
          "w-2 -mx-1",
          "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
          "data-[resize-handle-state=drag]:w-4"
        ],
        
        // Vertical handle
        direction === "vertical" && [
          "h-2 -my-1",
          "after:absolute after:inset-x-0 after:top-1/2 after:h-1 after:-translate-y-1/2",
          "data-[resize-handle-state=drag]:h-4"
        ],

        // Variant styles
        variant === "elegant" && "backdrop-blur-sm",
        variant === "modern" && "rounded-lg",

        handleClasses[handleStyle],
        className
      )}
      {...props}
    >
      {getHandleContent()}

      {/* Tooltip */}
      {showTooltip && tooltipText && (
        <div className={cn(
          "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md",
          "opacity-0 group-hover/handle:opacity-100 transition-opacity duration-200",
          "whitespace-nowrap pointer-events-none",
          direction === "horizontal" 
            ? "left-1/2 transform -translate-x-1/2 top-full mt-2" 
            : "top-1/2 transform -translate-y-1/2 left-full ml-2"
        )}>
          {tooltipText}
          <div className={cn(
            "absolute w-2 h-2 bg-gray-900 transform rotate-45",
            direction === "horizontal" 
              ? "top-0 left-1/2 -translate-x-1/2 -mt-1" 
              : "left-0 top-1/2 -translate-y-1/2 -ml-1"
          )} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

// مكون للعناوين والأقسام
interface ResizableSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  actions?: React.ReactNode
  collapsible?: boolean
  isCollapsed?: boolean
  onToggle?: () => void
}

const ResizableSection: React.FC<ResizableSectionProps> = ({
  title,
  actions,
  collapsible,
  isCollapsed,
  onToggle,
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("h-full flex flex-col", className)} {...props}>
      {(title || actions) && (
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          {title && (
            <h3 className="font-semibold text-sm flex items-center gap-2">
              {collapsible && (
                <button
                  onClick={onToggle}
                  className="p-1 rounded hover:bg-accent transition-colors"
                >
                  {isCollapsed ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                </button>
              )}
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex items-center gap-1">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn(
        "flex-1 overflow-auto transition-all duration-200",
        isCollapsed && "hidden"
      )}>
        {children}
      </div>
    </div>
  )
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  ResizableSection,
  useResizable,
}