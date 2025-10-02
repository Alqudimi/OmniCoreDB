import * as React from "react"
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const calendarVariants = cva(
  "p-4 rounded-2xl transition-all duration-500 ease-silk",
  {
    variants: {
      variant: {
        default: "bg-card border border-border/50 shadow-soft",
        glass: "glass-card border border-white/20 backdrop-blur-lg",
        elevated: "bg-card border border-border shadow-medium",
        premium: "bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 border border-primary/20 shadow-glow",
        minimalist: "bg-transparent border border-border/30 shadow-none"
      },
      size: {
        sm: "text-sm",
        md: "text-base", 
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export type CalendarProps = React.ComponentProps<typeof DayPicker> & VariantProps<typeof calendarVariants> & {
  showHeader?: boolean
  headerText?: string
  animated?: boolean
  showTodayButton?: boolean
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  variant = "default",
  size = "md",
  showHeader = true,
  headerText,
  animated = true,
  showTodayButton = false,
  ...props
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [isToday, setIsToday] = React.useState(false)

  const handleTodayClick = () => {
    const today = new Date()
    setSelectedDate(today)
    setIsToday(true)
    setTimeout(() => setIsToday(false), 2000)
  }

  return (
    <div className={cn("relative", animated && "animate-in fade-in-90 slide-in-from-top-4")}>
      {/* Header */}
      {showHeader && (
        <div className={cn(
          "flex items-center justify-between mb-4 p-4 rounded-xl",
          variant === "premium" && "bg-primary/10",
          variant === "glass" && "glass-premium"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              variant === "premium" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {headerText || "التقويم"}
              </h3>
              <p className="text-sm text-muted-foreground">
                اختر التاريخ المناسب
              </p>
            </div>
          </div>
          
          {showTodayButton && (
            <button
              onClick={handleTodayClick}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "transition-all duration-300 ease-magnetic",
                isToday && "bg-primary text-primary-foreground scale-110"
              )}
            >
              {isToday ? "تم!" : "اليوم"}
            </button>
          )}
        </div>
      )}

      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(calendarVariants({ variant, size }), className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0",
          month: "space-y-4",
          caption: cn(
            "flex justify-center pt-1 relative items-center pb-4",
            variant === "premium" && "border-b border-primary/20"
          ),
          caption_label: cn(
            "text-base font-semibold transition-colors duration-300",
            variant === "premium" && "text-primary"
          ),
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100",
            "transition-all duration-300 ease-magnetic hover:scale-110",
            variant === "premium" && "hover:bg-primary/20"
          ),
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",
          table: "w-full border-collapse space-y-1",
          head_row: "flex justify-between",
          head_cell: cn(
            "text-muted-foreground rounded-md w-10 font-medium text-sm py-3",
            variant === "premium" && "text-primary/80"
          ),
          row: "flex w-full justify-between mt-1",
          cell: cn(
            "h-10 w-10 text-center text-sm p-0 relative rounded-lg transition-all duration-300 ease-silk",
            "first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
            "[&:has([aria-selected].day-range-end)]:rounded-r-lg",
            "[&:has([aria-selected].day-outside)]:bg-accent/30",
            "[&:has([aria-selected])]:bg-accent",
            "hover:scale-105 focus-within:relative focus-within:z-20"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 w-10 p-0 font-normal transition-all duration-500 ease-magnetic",
            "aria-selected:opacity-100 hover:scale-110",
            variant === "premium" && "hover:bg-primary/20"
          ),
          day_range_end: "day-range-end bg-primary text-primary-foreground",
          day_selected: cn(
            "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
            "hover:bg-primary hover:text-primary-foreground",
            "focus:bg-primary focus:text-primary-foreground",
            "animate-in zoom-in-95 duration-300",
            variant === "premium" && "shadow-glow"
          ),
          day_today: cn(
            "bg-accent text-accent-foreground font-semibold",
            "border-2 border-primary/50 shadow-sm",
            variant === "premium" && "bg-primary/20 text-primary border-primary"
          ),
          day_outside: cn(
            "text-muted-foreground opacity-60",
            "aria-selected:bg-accent/30 aria-selected:text-muted-foreground"
          ),
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
          day_range_middle: cn(
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
            variant === "premium" && "aria-selected:bg-primary/10"
          ),
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("h-4 w-4", className)} {...props} />
          ),
        }}
        modifiersClassNames={{
          today: "font-bold",
          selected: "ring-2 ring-primary/20",
        }}
        modifiersStyles={{
          selected: { 
            fontWeight: 'bold',
            transform: 'scale(1.05)'
          },
          today: {
            border: '2px solid'
          }
        }}
        {...props}
      />

      {/* Decorative Elements */}
      {variant === "premium" && (
        <>
          <div className="absolute top-2 right-2 opacity-20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="absolute bottom-2 left-2 opacity-20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        </>
      )}
    </div>
  )
}
Calendar.displayName = "Calendar"

// Enhanced Calendar with Range Selection
interface RangeCalendarProps extends CalendarProps {
  onRangeSelect?: (range: { from: Date; to: Date } | undefined) => void
}

const RangeCalendar: React.FC<RangeCalendarProps> = ({
  onRangeSelect,
  ...props
}) => {
  const [range, setRange] = React.useState<{ from: Date; to: Date } | undefined>()

  const handleSelect = (range: any) => {
    setRange(range)
    onRangeSelect?.(range)
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        {...props}
      />
      
      {range?.from && (
        <div className={cn(
          "p-4 rounded-xl text-center text-sm font-medium",
          props.variant === "premium" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {range.from.toLocaleDateString('ar-SA')} 
          {range.to && ` - ${range.to.toLocaleDateString('ar-SA')}`}
        </div>
      )}
    </div>
  )
}

// Mini Calendar Component
const MiniCalendar: React.FC<CalendarProps> = (props) => {
  return (
    <Calendar
      className="p-2"
      showHeader={false}
      showOutsideDays={false}
      size="sm"
      {...props}
      classNames={{
        ...props.classNames,
        cell: "h-8 w-8",
        day: "h-8 w-8 text-xs",
        head_cell: "w-8 text-xs",
      }}
    />
  )
}

// Calendar with Events
interface EventCalendarProps extends CalendarProps {
  events: Array<{
    date: Date
    title: string
    color?: string
  }>
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, ...props }) => {
  const modifiers = {
    event: events.map(event => event.date),
  }

  const modifiersStyles = {
    event: {
      position: 'relative' as const,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
      }
    }
  }

  return (
    <Calendar
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      {...props}
    />
  )
}

export { 
  Calendar, 
  RangeCalendar, 
  MiniCalendar, 
  EventCalendar,
  calendarVariants 
}