import * as React from "react"
import { Eye, EyeOff, Search, X, Check, AlertCircle, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

// أنواع الأحجام والأنماط
type InputSize = "sm" | "md" | "lg" | "xl"
type InputVariant = "default" | "outline" | "filled" | "minimal" | "modern"
type InputStatus = "default" | "success" | "error" | "warning" | "loading"

interface InputProps extends React.ComponentProps<"input"> {
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  showPasswordToggle?: boolean
  isLoading?: boolean
  label?: string
  helperText?: string
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    size = "md",
    variant = "default",
    status = "default",
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    showPasswordToggle = false,
    isLoading = false,
    label,
    helperText,
    containerClassName,
    value,
    onChange,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const isPasswordType = type === "password"
    const currentType = isPasswordType && showPassword ? "text" : type

    const sizeClasses = {
      sm: "h-8 text-xs px-2.5 py-1.5",
      md: "h-10 text-sm px-3 py-2",
      lg: "h-12 text-base px-4 py-3",
      xl: "h-14 text-lg px-4 py-3",
    }

    const variantClasses = {
      default: cn(
        "border border-input bg-background shadow-sm",
        "hover:border-input/80",
        "focus:border-primary focus:ring-4 focus:ring-primary/20",
        "disabled:bg-muted/50 disabled:border-muted"
      ),
      outline: cn(
        "border-2 border-border bg-transparent",
        "hover:border-primary/50",
        "focus:border-primary focus:ring-2 focus:ring-primary/10",
        "disabled:border-muted/50"
      ),
      filled: cn(
        "border-0 bg-muted/50 border-b-2 border-transparent",
        "hover:bg-muted/70",
        "focus:bg-background focus:border-b-primary focus:ring-0",
        "disabled:bg-muted/30"
      ),
      minimal: cn(
        "border-0 bg-transparent border-b border-border",
        "hover:border-b-primary/50",
        "focus:border-b-primary focus:ring-0",
        "disabled:border-b-muted"
      ),
      modern: cn(
        "border border-input bg-background/50 backdrop-blur-sm",
        "hover:border-primary/50 hover:bg-background/70",
        "focus:border-primary focus:bg-background focus:shadow-lg focus:ring-4 focus:ring-primary/10",
        "disabled:bg-muted/30 disabled:border-muted"
      ),
    }

    const statusClasses = {
      default: "",
      success: cn(
        "border-success focus:border-success focus:ring-success/20",
        variant === "minimal" && "border-b-success",
        variant === "filled" && "focus:border-b-success"
      ),
      error: cn(
        "border-destructive focus:border-destructive focus:ring-destructive/20",
        variant === "minimal" && "border-b-destructive",
        variant === "filled" && "focus:border-b-destructive"
      ),
      warning: cn(
        "border-warning focus:border-warning focus:ring-warning/20",
        variant === "minimal" && "border-b-warning",
        variant === "filled" && "focus:border-b-warning"
      ),
      loading: "",
    }

    const statusIcons = {
      success: <Check className="h-4 w-4 text-success" />,
      error: <AlertCircle className="h-4 w-4 text-destructive" />,
      warning: <AlertCircle className="h-4 w-4 text-warning" />,
      loading: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
    }

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Create synthetic event to clear input
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>
        
        onChange(syntheticEvent)
      }
      
      if (onClear) {
        onClear()
      }
    }

    const shouldShowClear = clearable && value && !disabled

    return (
      <div className={cn("space-y-2 w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              status === "error" ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className={cn(
          "relative flex items-center transition-all duration-200 rounded-md",
          variantClasses[variant],
          statusClasses[status],
          disabled && "opacity-50 cursor-not-allowed",
          isFocused && "ring-offset-2"
        )}>
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 flex items-center justify-center text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Search Icon for search type */}
          {type === "search" && !leftIcon && (
            <div className="absolute left-3 flex items-center justify-center text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
          )}

          {/* Input Element */}
          <input
            type={currentType}
            className={cn(
              "flex w-full bg-transparent placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              sizeClasses[size],
              (leftIcon || type === "search") && "pl-9",
              (shouldShowClear || rightIcon || showPasswordToggle || status !== "default" || isLoading) && "pr-9",
              className
            )}
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute right-3 flex items-center gap-1">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Status Icon */}
            {!isLoading && status !== "default" && statusIcons[status]}

            {/* Clear Button */}
            {shouldShowClear && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center rounded-full p-0.5 hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                aria-label="مسح النص"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            )}

            {/* Password Toggle */}
            {showPasswordToggle && isPasswordType && !isLoading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center justify-center rounded-full p-0.5 hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !isLoading && !shouldShowClear && !(showPasswordToggle && isPasswordType) && (
              <div className="flex items-center justify-center text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <p className={cn(
            "text-xs font-medium",
            status === "error" && "text-destructive",
            status === "warning" && "text-warning",
            status === "success" && "text-success",
            status === "default" && "text-muted-foreground"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// مكون Input Group لتجميع عدة inputs
interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "space-y-3",
        orientation === "horizontal" && "flex flex-row gap-3 items-end",
        className
      )}
      {...props}
    />
  )
)
InputGroup.displayName = "InputGroup"

// مكون Search Input مخصص
interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        clearable
        placeholder="ابحث..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch(e.currentTarget.value)
          }
        }}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

export { Input, InputGroup, SearchInput }