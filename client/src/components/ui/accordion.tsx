import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  ChevronDown, 
  Plus,
  Minus,
  ChevronRight,
  ArrowDown,
  Sparkles,
  Activity,
  Shield,
  Star
} from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const accordionItemVariants = cva(
  "transition-all duration-500 ease-silk overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-b border-border/50",
        glass: "glass-premium rounded-2xl mb-4 border border-white/20",
        elevated: "bg-card rounded-2xl mb-3 shadow-soft hover:shadow-medium border",
        minimal: "border-none",
        premium: "bg-gradient-to-r from-primary/5 to-transparent rounded-2xl mb-4 border border-primary/20"
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

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  VariantProps<typeof accordionItemVariants> & {
    glow?: boolean
  }
>(({ className, variant, size, glow = false, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      accordionItemVariants({ variant, size }),
      glow && "shadow-glow hover:shadow-glow-lg",
      "group",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const accordionTriggerVariants = cva(
  "flex flex-1 items-center justify-between w-full text-left transition-all duration-500 ease-magnetic",
  "font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:rounded-lg",
  {
    variants: {
      variant: {
        default: "py-4 hover:text-primary [&[data-state=open]]:text-primary",
        glass: "p-6 hover:bg-white/5 [&[data-state=open]]:bg-white/10",
        elevated: "p-6 hover:bg-accent/50 [&[data-state=open]]:bg-accent",
        minimal: "py-3 hover:text-primary [&[data-state=open]]:text-primary",
        premium: "p-6 hover:bg-primary/10 [&[data-state=open]]:bg-primary/15 [&[data-state=open]]:text-primary"
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

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> &
  VariantProps<typeof accordionTriggerVariants> & {
    icon?: "chevron" | "plus" | "arrow" | "sparkle" | "custom"
    customIcon?: React.ReactNode
    showIndicator?: boolean
    indicatorPosition?: "left" | "right"
  }
>(({ 
  className, 
  variant, 
  size, 
  icon = "chevron",
  customIcon,
  showIndicator = true,
  indicatorPosition = "right",
  children, 
  ...props 
}, ref) => {
  const iconComponents = {
    chevron: ChevronDown,
    plus: Plus,
    arrow: ArrowDown,
    sparkle: Sparkles
  }

  const IconComponent = iconComponents[icon]

  const triggerContent = (
    <>
      {showIndicator && indicatorPosition === "left" && (
        <div className="flex items-center mr-3 transition-transform duration-500 group-data-[state=open]:rotate-90">
          {customIcon || <ChevronRight className="h-4 w-4" />}
        </div>
      )}
      
      <span className="flex-1 transition-all duration-300 group-hover:translate-x-1">
        {children}
      </span>

      {showIndicator && indicatorPosition === "right" && (
        <div className={cn(
          "flex items-center ml-3 transition-all duration-500 ease-magnetic",
          "group-data-[state=open]:rotate-180",
          icon === "plus" && "group-data-[state=open]:hidden",
          icon === "sparkle" && "group-data-[state=open]:text-primary"
        )}>
          {customIcon ? (
            customIcon
          ) : icon === "plus" ? (
            <>
              <Plus className="h-4 w-4 block group-data-[state=open]:hidden" />
              <Minus className="h-4 w-4 hidden group-data-[state=open]:block" />
            </>
          ) : (
            <IconComponent className="h-4 w-4" />
          )}
        </div>
      )}
    </>
  )

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(accordionTriggerVariants({ variant, size }), className)}
        {...props}
      >
        {triggerContent}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const accordionContentVariants = cva(
  "overflow-hidden transition-all duration-700 ease-silk",
  "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        default: "px-1",
        glass: "px-6",
        elevated: "px-6",
        minimal: "px-1",
        premium: "px-6"
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

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> &
  VariantProps<typeof accordionContentVariants> & {
    animated?: boolean
    gradient?: boolean
  }
>(({ className, variant, size, animated = true, gradient = false, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      accordionContentVariants({ variant, size }),
      animated && "data-[state=open]:animate-in data-[state=closed]:animate-out",
      gradient && "bg-gradient-to-b from-transparent to-muted/20",
      className
    )}
    {...props}
  >
    <div className={cn(
      "transition-all duration-500 ease-silk",
      variant === "default" && "pb-4 pt-0",
      variant === "glass" && "pb-6 pt-2",
      variant === "elevated" && "pb-6 pt-2",
      variant === "minimal" && "pb-3 pt-0",
      variant === "premium" && "pb-6 pt-2",
      "border-l-2 border-transparent group-data-[state=open]:border-primary/30 ml-3 pl-3"
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// Enhanced Accordion with Icons
interface EnhancedAccordionProps {
  items: Array<{
    id: string
    trigger: React.ReactNode
    content: React.ReactNode
    icon?: React.ReactNode
    variant?: VariantProps<typeof accordionItemVariants>["variant"]
    disabled?: boolean
  }>
  type?: "single" | "multiple"
  variant?: VariantProps<typeof accordionItemVariants>["variant"]
  size?: VariantProps<typeof accordionItemVariants>["size"]
  className?: string
}

const EnhancedAccordion: React.FC<EnhancedAccordionProps> = ({
  items,
  type = "single",
  variant = "default",
  size = "md",
  className
}) => {
  return (
    <Accordion type={type} className={className}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          variant={item.variant || variant}
          size={size}
          disabled={item.disabled}
        >
          <AccordionTrigger
            variant={item.variant || variant}
            size={size}
            customIcon={item.icon}
            indicatorPosition={item.icon ? "left" : "right"}
          >
            {item.trigger}
          </AccordionTrigger>
          <AccordionContent variant={item.variant || variant} size={size}>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// Animated Accordion with staggered animations
const AnimatedAccordion = React.forwardRef<
  React.ElementRef<typeof Accordion>,
  React.ComponentProps<typeof Accordion> & {
    staggerDelay?: number
  }
>(({ children, staggerDelay = 100, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children)
  
  return (
    <Accordion ref={ref} {...props}>
      {childrenArray.map((child, index) =>
        React.isValidElement(child) 
          ? React.cloneElement(child, {
              // @ts-ignore
              style: {
                animationDelay: `${index * staggerDelay}ms`
              }
            })
          : child
      )}
    </Accordion>
  )
})
AnimatedAccordion.displayName = "AnimatedAccordion"

// Premium Accordion with special effects
const PremiumAccordion: React.FC<EnhancedAccordionProps> = (props) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl blur-xl opacity-50" />
      <EnhancedAccordion
        {...props}
        variant="premium"
        className="relative z-10"
      />
    </div>
  )
}

// Export everything
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  EnhancedAccordion,
  AnimatedAccordion,
  PremiumAccordion,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants
}