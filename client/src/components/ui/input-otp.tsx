import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot, Minus, Sparkles, Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput> & {
    variant?: "default" | "elegant" | "modern" | "minimal"
    status?: "default" | "success" | "error" | "loading"
  }
>(({ className, containerClassName, variant = "default", status = "default", ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)

  const variantStyles = {
    default: "gap-3",
    elegant: "gap-4",
    modern: "gap-2",
    minimal: "gap-1"
  }

  const statusStyles = {
    default: "",
    success: "has-[:data-status=success]:border-success has-[:data-status=success]:text-success",
    error: "has-[:data-status=error]:border-destructive has-[:data-status=error]:text-destructive",
    loading: "has-[:data-status=loading]:animate-pulse"
  }

  return (
    <div className={cn("relative transition-all duration-300", statusStyles[status])}>
      <OTPInput
        ref={ref}
        containerClassName={cn(
          "flex items-center justify-center transition-all duration-300",
          variantStyles[variant],
          statusStyles[status],
          "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
          containerClassName
        )}
        className={cn(
          "disabled:cursor-not-allowed outline-none",
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {/* Focus indicator */}
      {isFocused && (
        <div className={cn(
          "absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300",
          "bg-gradient-to-r from-primary/5 via-transparent to-primary/5",
          "border border-primary/20",
          variant === "minimal" && "rounded-lg"
        )} />
      )}
    </div>
  )
})
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    variant?: "default" | "elegant" | "modern" | "minimal"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "gap-2",
    elegant: "gap-3",
    modern: "gap-1",
    minimal: "gap-0"
  }

  return (
    <div 
      ref={ref} 
      className={cn(
        "flex items-center transition-all duration-300",
        variantStyles[variant],
        className
      )} 
      {...props} 
    />
  )
})
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { 
    index: number 
    variant?: "default" | "elegant" | "modern" | "minimal"
    status?: "default" | "success" | "error" | "loading"
    hasShake?: boolean
  }
>(({ index, className, variant = "default", status = "default", hasShake = true, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  const variantStyles = {
    default: cn(
      "relative flex h-12 w-12 items-center justify-center border-2 border-input text-lg font-semibold transition-all duration-300",
      "first:rounded-l-xl last:rounded-r-xl",
      "hover:border-primary/30 hover:shadow-md hover:scale-105",
      "focus-within:border-primary focus-within:shadow-lg focus-within:scale-105",
      isActive && "z-10 border-primary shadow-lg scale-105 ring-4 ring-primary/20"
    ),
    elegant: cn(
      "relative flex h-14 w-14 items-center justify-center border-2 border-border/50 bg-background/50 text-xl font-medium transition-all duration-500",
      "first:rounded-2xl last:rounded-2xl rounded-xl",
      "hover:border-primary/40 hover:bg-primary/5 hover:shadow-xl",
      "focus-within:border-primary focus-within:bg-primary/10 focus-within:shadow-2xl",
      isActive && "z-10 border-primary bg-primary/10 shadow-2xl scale-110 ring-4 ring-primary/30"
    ),
    modern: cn(
      "relative flex h-10 w-10 items-center justify-center border-b-4 border-input bg-transparent text-base font-bold transition-all duration-200",
      "first:rounded-tl-md last:rounded-tr-md",
      "hover:border-primary/60 hover:bg-primary/5",
      "focus-within:border-primary focus-within:bg-primary/10",
      isActive && "z-10 border-primary bg-primary/10 scale-105"
    ),
    minimal: cn(
      "relative flex h-8 w-8 items-center justify-center border-b border-input bg-transparent text-sm transition-all duration-150",
      "hover:border-primary",
      "focus-within:border-primary",
      isActive && "z-10 border-primary scale-110"
    )
  }

  const statusStyles = {
    default: "",
    success: "border-success text-success bg-success/5",
    error: cn(
      "border-destructive text-destructive bg-destructive/5",
      hasShake && "animate-shake"
    ),
    loading: "animate-pulse border-muted-foreground/30"
  }

  const StatusIcon = {
    success: <Check className="h-4 w-4 absolute -top-2 -right-2 bg-success text-success-foreground rounded-full p-0.5" />,
    error: <X className="h-4 w-4 absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5" />,
    loading: <div className="h-4 w-4 absolute -top-2 -right-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  }

  return (
    <div
      ref={ref}
      className={cn(
        variantStyles[variant],
        statusStyles[status],
        "group transition-all duration-300",
        className
      )}
      data-status={status}
      {...props}
    >
      <span className={cn(
        "transition-all duration-300 transform",
        isActive && "scale-110",
        status === "success" && "text-success",
        status === "error" && "text-destructive"
      )}>
        {char || (isActive && <span className="invisible">0</span>)}
      </span>
      
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "h-6 w-0.5 bg-primary animate-caret-blink duration-1000 transition-all",
            variant === "minimal" && "h-4",
            variant === "modern" && "h-5"
          )} />
        </div>
      )}
      
      {/* Status indicator */}
      {status !== "default" && StatusIcon[status]}
      
      {/* Hover effect */}
      <div className={cn(
        "absolute inset-0 rounded-inherit opacity-0 transition-all duration-300",
        "bg-gradient-to-br from-primary/10 to-transparent",
        "group-hover:opacity-100"
      )} />
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    variant?: "default" | "elegant" | "modern" | "minimal"
    type?: "dot" | "line" | "dash" | "sparkle"
  }
>(({ variant = "default", type = "dot", ...props }, ref) => {
  const variantStyles = {
    default: "mx-1",
    elegant: "mx-2",
    modern: "mx-0.5",
    minimal: "mx-0"
  }

  const separatorIcons = {
    dot: <Dot className="h-4 w-4 text-muted-foreground/50" />,
    line: <div className="h-0.5 w-4 bg-muted-foreground/30 rounded-full" />,
    dash: <Minus className="h-4 w-4 text-muted-foreground/40" />,
    sparkle: <Sparkles className="h-4 w-4 text-muted-foreground/40 opacity-70" />
  }

  return (
    <div 
      ref={ref} 
      className={cn(
        "flex items-center justify-center transition-all duration-300",
        variantStyles[variant]
      )} 
      role="separator" 
      {...props}
    >
      {separatorIcons[type]}
    </div>
  )
})
InputOTPSeparator.displayName = "InputOTPSeparator"

// مكون إضافي لعرض حالة التحميل أو النجاح
const InputOTPStatus = ({
  status,
  message,
  className
}: {
  status: "default" | "success" | "error" | "loading"
  message?: string
  className?: string
}) => {
  const statusConfig = {
    default: { icon: null, color: "text-muted-foreground" },
    success: { icon: <Check className="h-4 w-4" />, color: "text-success" },
    error: { icon: <X className="h-4 w-4" />, color: "text-destructive" },
    loading: { icon: <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />, color: "text-primary" }
  }

  const config = statusConfig[status]

  if (!message && status === "default") return null

  return (
    <div className={cn(
      "flex items-center gap-2 mt-2 text-sm transition-all duration-300",
      config.color,
      className
    )}>
      {config.icon}
      <span>{message}</span>
    </div>
  )
}

// مكون للعرض المرئي لقوة الرمز
const InputOTPStrength = ({
  strength = 0,
  maxStrength = 4,
  className
}: {
  strength?: number
  maxStrength?: number
  className?: string
}) => {
  return (
    <div className={cn("flex items-center gap-1 mt-2", className)}>
      {Array.from({ length: maxStrength }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1 flex-1 rounded-full transition-all duration-500 ease-out",
            index < strength 
              ? index < 2 
                ? "bg-destructive" 
                : index < 3 
                  ? "bg-amber-500" 
                  : "bg-success"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  )
}

// أنماط CSS مخصصة للحركات
const InputOTPStyles = () => (
  <style jsx global>{`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes caret-blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    .animate-caret-blink {
      animation: caret-blink 1s infinite;
    }
    
    .rounded-inherit {
      border-radius: inherit;
    }
  `}</style>
)

export { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot, 
  InputOTPSeparator,
  InputOTPStatus,
  InputOTPStrength,
  InputOTPStyles
}