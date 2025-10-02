"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    gradient?: {
      start: string
      end: string
    }
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
  id: string
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

// أنواع الأحجام والأنماط
type ChartSize = "sm" | "md" | "lg" | "xl" | "full"
type ChartVariant = "default" | "minimal" | "elegant" | "modern"

interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  size?: ChartSize
  variant?: ChartVariant
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ 
    id, 
    className, 
    children, 
    config, 
    size = "md",
    variant = "default",
    loading = false,
    error = null,
    onRetry,
    ...props 
  }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    const sizeClasses = {
      sm: "h-48 md:h-56",
      md: "h-56 md:h-64 lg:h-72",
      lg: "h-64 md:h-72 lg:h-80",
      xl: "h-72 md:h-80 lg:h-96",
      full: "h-80 md:h-96 lg:h-[500px]",
    }

    const variantClasses = {
      default: "bg-card border shadow-sm rounded-xl",
      minimal: "bg-transparent border-0 shadow-none",
      elegant: "bg-gradient-to-br from-card to-card/80 border-0 shadow-lg rounded-2xl backdrop-blur-sm",
      modern: "bg-card border shadow-lg rounded-2xl",
    }

    return (
      <ChartContext.Provider value={{ config, id: chartId }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            "relative flex justify-center text-xs transition-all duration-300 ease-in-out",
            // الأنماط الأساسية
            "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/30",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-layer]:outline-none",
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
            "[&_.recharts-radial-bar-background-sector]:fill-muted/50",
            "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/20",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
            "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-sector]:outline-none",
            "[&_.recharts-surface]:outline-none",
            // تحسينات إضافية
            "[&_.recharts-legend-wrapper]:mt-4",
            "[&_.recharts-tooltip-wrapper]:shadow-xl",
            // الأحجام والأنماط
            sizeClasses[size],
            variantClasses[variant],
            className
          )}
          {...props}
        >
          {/* حالة التحميل */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">جاري تحميل البيانات...</p>
              </div>
            </div>
          )}

          {/* حالة الخطأ */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl z-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-full bg-destructive/10 p-3">
                  <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    إعادة المحاولة
                  </button>
                )}
              </div>
            </div>
          )}

          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>

          {/* خلفية متدرجة للأنماط الخاصة */}
          {variant === "elegant" && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl pointer-events-none" />
          )}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed" | "square"
      nameKey?: string
      labelKey?: string
      showGradient?: boolean
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      showGradient = false,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[10rem] items-start gap-2 rounded-xl border border-border/50 bg-background/95 backdrop-blur-sm px-3 py-2.5 text-sm shadow-2xl",
          showGradient && "bg-gradient-to-br from-background to-background/80",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-2">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[4px] border-[--color-border] bg-[--color-bg] transition-all duration-200",
                            {
                              "h-3 w-3 rounded-full": indicator === "dot",
                              "w-1.5 rounded-full": indicator === "line",
                              "w-2 rounded-sm": indicator === "square",
                              "w-0 border-[1.5px] border-dashed bg-transparent rounded-none":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground font-medium">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-semibold tabular-nums text-foreground">
                          {typeof item.value === 'number' 
                            ? item.value.toLocaleString() 
                            : item.value
                          }
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
      variant?: "default" | "minimal" | "cards"
    }
>(
  (
    { 
      className, 
      hideIcon = false, 
      payload, 
      verticalAlign = "bottom", 
      nameKey,
      variant = "default",
      ...props 
    },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    const variantClasses = {
      default: "gap-4",
      minimal: "gap-3",
      cards: "gap-2",
    }

    const itemClasses = {
      default: "px-3 py-1.5 rounded-lg bg-muted/20 border border-border/50",
      minimal: "px-0 py-0",
      cards: "px-2 py-1 rounded-md bg-card border shadow-sm",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-center",
          verticalAlign === "top" ? "pb-4" : "pt-4",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-2 transition-all duration-200 hover:scale-105",
                "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-muted-foreground",
                itemClasses[variant]
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-3 w-3 shrink-0 rounded-full border-2 border-white shadow-sm"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              <span className="text-sm font-medium whitespace-nowrap">
                {itemConfig?.label || item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

// مكون مساعد للعناوين والإحصائيات
interface ChartHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  value?: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
}

const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  description,
  value,
  change,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-2 mb-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {(value || change) && (
          <div className="flex flex-col items-end gap-1">
            {value && (
              <span className="text-2xl font-bold text-foreground">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
            )}
            {change && (
              <span
                className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  change.type === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {change.type === "increase" ? "↑" : "↓"}
                {Math.abs(change.value)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartHeader,
}