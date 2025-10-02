import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal, Home } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => (
  <nav 
    ref={ref} 
    aria-label="breadcrumb" 
    className="w-full"
    {...props} 
  />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-2 sm:gap-3 break-words",
      "text-sm sm:text-base transition-all duration-200",
      "min-h-[2.5rem] items-stretch",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "inline-flex items-center group",
      "transition-all duration-200",
      className
    )}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
    isHome?: boolean
  }
>(({ asChild, className, isHome = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex items-center gap-2 transition-all duration-300",
        "px-3 py-2 rounded-lg font-medium",
        "text-muted-foreground/80 hover:text-foreground",
        "hover:bg-accent/50 border border-transparent",
        "hover:border-accent/30 backdrop-blur-sm",
        "group-hover:scale-105 transform origin-center",
        isHome && "bg-primary/5 border-primary/20 text-primary",
        "min-h-[2rem]",
        "text-xs sm:text-sm",
        className
      )}
      {...props}
    >
      {isHome && <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
      {props.children}
    </Comp>
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span"> & {
    isCurrent?: boolean
  }
>(({ className, isCurrent = true, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current={isCurrent ? "page" : undefined}
    className={cn(
      "flex items-center px-4 py-2 rounded-xl font-semibold",
      "bg-gradient-to-r from-primary to-primary/80",
      "text-primary-foreground shadow-lg shadow-primary/25",
      "border border-primary/30 backdrop-blur-md",
      "transform hover:scale-105 transition-all duration-300",
      "min-h-[2rem] text-xs sm:text-sm",
      "animate-in fade-in-50 duration-500",
      className
    )}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      "flex items-center text-muted-foreground/40",
      "mx-1 transition-transform duration-200",
      "group-hover:rotate-12 transform",
      className
    )}
    {...props}
  >
    {children ?? (
      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
    )}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "flex items-center justify-center",
      "w-8 h-8 sm:w-10 sm:h-10 rounded-lg",
      "bg-muted/50 border border-muted-foreground/20",
      "backdrop-blur-sm transition-all duration-300",
      "hover:bg-muted hover:scale-110 cursor-pointer",
      "group relative",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/70" />
    <span className="sr-only">More</span>
    
    {/* Tooltip effect */}
    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
      <div className="bg-foreground text-background px-2 py-1 rounded-md text-xs whitespace-nowrap">
        More pages
      </div>
    </div>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

// New responsive container component
const BreadcrumbContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    variant?: "default" | "glass" | "minimal"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full max-w-full overflow-hidden",
      "px-4 sm:px-6 lg:px-8 py-3",
      {
        "bg-background": variant === "default",
        "bg-background/80 backdrop-blur-md border-b": variant === "glass",
        "bg-transparent": variant === "minimal",
      },
      "transition-all duration-300",
      className
    )}
    {...props}
  />
))
BreadcrumbContainer.displayName = "BreadcrumbContainer"

// New responsive breadcrumb with auto-collapse
interface ResponsiveBreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    isCurrent?: boolean
  }>
  maxItems?: number
  showHome?: boolean
  className?: string
}

const ResponsiveBreadcrumb: React.FC<ResponsiveBreadcrumbProps> = ({
  items,
  maxItems = 4,
  showHome = true,
  className,
}) => {
  const shouldCollapse = items.length > maxItems
  
  let displayedItems = items
  let collapsedItems: typeof items = []

  if (shouldCollapse) {
    const startItems = items.slice(0, 1)
    const endItems = items.slice(-2)
    collapsedItems = items.slice(1, -2)
    displayedItems = [...startItems, ...endItems]
  }

  return (
    <BreadcrumbContainer className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {showHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" isHome>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}

          {shouldCollapse ? (
            <>
              {/* First item */}
              <BreadcrumbItem>
                {displayedItems[0].href ? (
                  <BreadcrumbLink href={displayedItems[0].href}>
                    {displayedItems[0].label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage isCurrent={displayedItems[0].isCurrent}>
                    {displayedItems[0].label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              
              <BreadcrumbSeparator />

              {/* Ellipsis for collapsed items */}
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              
              <BreadcrumbSeparator />

              {/* Last two items */}
              {displayedItems.slice(1).map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage isCurrent={item.isCurrent}>
                        {item.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < displayedItems.slice(1).length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            // Full breadcrumb when not collapsed
            displayedItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage isCurrent={item.isCurrent}>
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < displayedItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </BreadcrumbContainer>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbContainer,
  ResponsiveBreadcrumb,
}