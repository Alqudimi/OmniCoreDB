import * as React from "react"
import { AlertCircle, CheckCircle, Eye, EyeOff, Sparkles, Zap, Lock, Unlock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    variant?: "default" | "elegant" | "modern" | "minimal" | "glass"
    status?: "default" | "success" | "error" | "warning"
    resize?: "none" | "vertical" | "horizontal" | "both"
    showCount?: boolean
    maxLength?: number
    autoGrow?: boolean
    label?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    showPasswordToggle?: boolean
    isPassword?: boolean
  }
>(({ 
  className,
  variant = "default",
  status = "default",
  resize = "vertical",
  showCount = false,
  maxLength,
  autoGrow = false,
  label,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  isPassword = false,
  rows = 4,
  ...props 
}, ref) => {
  const [value, setValue] = React.useState(props.value || props.defaultValue || "")
  const [isFocused, setIsFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  // Auto-grow functionality
  React.useEffect(() => {
    if (autoGrow && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value, autoGrow])

  const variantStyles = {
    default: cn(
      "bg-background border-input shadow-sm",
      "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
    ),
    elegant: cn(
      "bg-background/50 backdrop-blur-sm border-border/50",
      "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-background/80"
    ),
    modern: cn(
      "bg-muted/20 border-muted-foreground/20",
      "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:bg-background"
    ),
    minimal: cn(
      "bg-transparent border-border/30 border-b border-t-0 border-l-0 border-r-0 rounded-none",
      "focus-visible:border-primary focus-visible:ring-0 focus-visible:bg-transparent"
    ),
    glass: cn(
      "bg-background/80 backdrop-blur-xl border-white/20",
      "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background/90"
    )
  }

  const statusStyles = {
    default: "",
    success: "border-success focus-visible:border-success focus-visible:ring-success/20",
    error: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
    warning: "border-warning focus-visible:border-warning focus-visible:ring-warning/20"
  }

  const resizeStyles = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize"
  }

  const StatusIcon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    default: null
  }

  const StatusIconComponent = StatusIcon[status]

  const characterCount = typeof value === 'string' ? value.length : 0
  const isNearLimit = maxLength && characterCount > maxLength * 0.8
  const isOverLimit = maxLength && characterCount > maxLength

  return (
    <div className="w-full space-y-2 transition-all duration-300">
      {/* Label */}
      {label && (
        <label className={cn(
          "text-sm font-medium leading-none transition-colors duration-200",
          status === "error" && "text-destructive",
          status === "success" && "text-success",
          status === "warning" && "text-warning"
        )}>
          {label}
        </label>
      )}

      {/* Textarea Container */}
      <div className={cn(
        "relative group transition-all duration-300",
        isFocused && "scale-[1.02]"
      )}>
        {/* Left Icon */}
        {leftIcon && (
          <div className={cn(
            "absolute left-3 top-3 z-10 transition-all duration-300",
            "text-muted-foreground group-focus-within:text-foreground",
            status === "success" && "text-success",
            status === "error" && "text-destructive",
            status === "warning" && "text-warning"
          )}>
            {leftIcon}
          </div>
        )}

        {/* Textarea Element */}
        <textarea
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            textareaRef.current = node
          }}
          rows={rows}
          className={cn(
            "flex min-h-[80px] w-full rounded-xl px-4 py-3 text-base ring-offset-background",
            "placeholder:text-muted-foreground/70",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "border-2",
            variantStyles[variant],
            statusStyles[status],
            resizeStyles[resize],
            leftIcon && "pl-10",
            (rightIcon || StatusIconComponent || showPasswordToggle) && "pr-10",
            showCount && maxLength && "pb-8",
            autoGrow && "overflow-hidden",
            className
          )}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
          {...props}
          type={isPassword && !showPassword ? "password" : "text"}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-3 flex items-center gap-1">
          {/* Status Icon */}
          {StatusIconComponent && (
            <StatusIconComponent className={cn(
              "h-4 w-4 transition-all duration-300",
              status === "success" && "text-success",
              status === "error" && "text-destructive animate-pulse",
              status === "warning" && "text-warning"
            )} />
          )}

          {/* Custom Right Icon */}
          {rightIcon && !showPasswordToggle && (
            <div className={cn(
              "text-muted-foreground transition-all duration-300",
              "group-focus-within:text-foreground"
            )}>
              {rightIcon}
            </div>
          )}

          {/* Password Toggle */}
          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 w-6 p-0 hover:bg-transparent",
                "text-muted-foreground hover:text-foreground",
                "transition-all duration-300 hover:scale-110"
              )}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          )}
        </div>

        {/* Character Count */}
        {showCount && maxLength && (
          <div className={cn(
            "absolute bottom-2 right-3 text-xs transition-all duration-300",
            isOverLimit ? "text-destructive font-semibold animate-pulse" :
            isNearLimit ? "text-warning" :
            "text-muted-foreground/70"
          )}>
            {characterCount}/{maxLength}
          </div>
        )}
      </div>

      {/* Helper Text and Status Message */}
      {(helperText || status !== "default") && (
        <div className={cn(
          "flex items-center gap-2 text-xs transition-all duration-300",
          status === "error" && "text-destructive",
          status === "success" && "text-success",
          status === "warning" && "text-warning",
          status === "default" && "text-muted-foreground"
        )}>
          {status === "error" && <AlertCircle className="h-3 w-3 flex-shrink-0" />}
          {status === "success" && <CheckCircle className="h-3 w-3 flex-shrink-0" />}
          {status === "warning" && <AlertCircle className="h-3 w-3 flex-shrink-0" />}
          <span>{helperText}</span>
        </div>
      )}

      {/* Progress Bar for Character Limit */}
      {showCount && maxLength && (
        <div className="w-full bg-muted rounded-full h-1 overflow-hidden transition-all duration-300">
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out",
              isOverLimit ? "bg-destructive" :
              isNearLimit ? "bg-warning" :
              "bg-primary"
            )}
            style={{ 
              width: `${Math.min((characterCount / maxLength) * 100, 100)}%` 
            }}
          />
        </div>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

// مكون Textarea مع Auto-resize مدمج
const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      autoGrow={true}
      className={cn("overflow-hidden", className)}
      {...props}
    />
  )
})
AutoResizeTextarea.displayName = "AutoResizeTextarea"

// مكون Textarea مع Markdown Preview
const MarkdownTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea> & {
    showPreview?: boolean
    onPreviewToggle?: (show: boolean) => void
  }
>(({ className, showPreview = false, onPreviewToggle, ...props }, ref) => {
  const [isPreview, setIsPreview] = React.useState(showPreview)

  const togglePreview = () => {
    setIsPreview(!isPreview)
    onPreviewToggle?.(!isPreview)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Markdown Editor</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={togglePreview}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>
      
      {isPreview ? (
        <div className={cn(
          "min-h-[80px] w-full rounded-xl border-2 border-border bg-muted/20 p-4",
          "prose prose-sm max-w-none",
          className
        )}>
          {/* هنا يمكن إضافة معاينة Markdown */}
          <p className="text-muted-foreground">
            Markdown preview will be displayed here...
          </p>
        </div>
      ) : (
        <Textarea
          ref={ref}
          className={cn("font-mono text-sm", className)}
          leftIcon={<Zap className="h-4 w-4" />}
          {...props}
        />
      )}
    </div>
  )
})
MarkdownTextarea.displayName = "MarkdownTextarea"

// أنماط CSS مخصصة للحركات
const TextareaStyles = () => (
  <style jsx global>{`
    @keyframes textarea-pulse {
      0%, 100% { border-color: hsl(var(--border)); }
      50% { border-color: hsl(var(--primary)); }
    }
    
    @keyframes textarea-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }
    
    .textarea-pulse {
      animation: textarea-pulse 2s ease-in-out infinite;
    }
    
    .textarea-shake {
      animation: textarea-shake 0.5s ease-in-out;
    }
    
    /* تحسينات شريط التمرير */
    textarea::-webkit-scrollbar {
      width: 6px;
    }
    
    textarea::-webkit-scrollbar-track {
      background: hsl(var(--muted));
      border-radius: 3px;
    }
    
    textarea::-webkit-scrollbar-thumb {
      background: hsl(var(--muted-foreground) / 0.3);
      border-radius: 3px;
    }
    
    textarea::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--muted-foreground) / 0.5);
    }
  `}</style>
)

export { 
  Textarea, 
  AutoResizeTextarea, 
  MarkdownTextarea, 
  TextareaStyles 
}