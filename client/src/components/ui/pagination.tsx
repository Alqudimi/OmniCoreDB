import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowLeft, ArrowRight, StepBack, StepForward } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

// Types
interface PaginationProps {
  variant?: "default" | "modern" | "minimal" | "bordered"
  size?: "sm" | "md" | "lg"
  shape?: "square" | "rounded" | "circular"
  showNumbers?: boolean
  showEdgeButtons?: boolean
  showInfo?: boolean
}

// Main Pagination Component
const Pagination = ({ 
  className, 
  variant = "default",
  ...props 
}: React.ComponentProps<"nav"> & PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn(
      "mx-auto flex w-full justify-center",
      variant === "modern" && "p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl",
      className
    )}
    {...props}
  />
)
Pagination.displayName = "Pagination"

// Pagination Content
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul"> & {
    centered?: boolean
  }
>(({ className, centered = false, ...props }, ref) => (
  <motion.ul
    ref={ref}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "flex flex-row items-center gap-1 lg:gap-2",
      centered && "justify-center",
      className
    )}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

// Pagination Item
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & {
    animated?: boolean
  }
>(({ className, animated = true, ...props }, ref) => (
  <motion.li 
    ref={ref} 
    whileHover={animated ? { scale: 1.05 } : {}}
    whileTap={animated ? { scale: 0.95 } : {}}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={cn("", className)} 
    {...props} 
  />
))
PaginationItem.displayName = "PaginationItem"

// Pagination Link
type PaginationLinkProps = {
  isActive?: boolean
  isDisabled?: boolean
  showHoverEffect?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  isDisabled,
  size = "icon",
  showHoverEffect = true,
  ...props
}: PaginationLinkProps) => (
  <motion.a
    aria-current={isActive ? "page" : undefined}
    aria-disabled={isDisabled}
    whileHover={!isDisabled && showHoverEffect ? { 
      scale: 1.05,
      backgroundColor: isActive ? "rgb(59, 130, 246)" : "rgb(243, 244, 246)"
    } : {}}
    whileTap={!isDisabled ? { scale: 0.95 } : {}}
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : isDisabled ? "ghost" : "outline",
        size,
      }),
      "relative transition-all duration-300 font-medium",
      isActive && [
        "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25",
        "border-blue-500 dark:from-blue-600 dark:to-blue-700"
      ],
      isDisabled && [
        "opacity-50 cursor-not-allowed pointer-events-none",
        "text-gray-400 dark:text-gray-600"
      ],
      !isActive && !isDisabled && [
        "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100",
        "dark:hover:from-gray-800 dark:hover:to-gray-700",
        "border-gray-200 dark:border-gray-700",
        "hover:border-blue-300 dark:hover:border-blue-600"
      ],
      "min-w-[2.5rem] h-10 flex items-center justify-center",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

// Pagination Previous
const PaginationPrevious = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { variant?: "default" | "modern" }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      "gap-2 pl-3 pr-4 transition-all duration-300",
      variant === "modern" && [
        "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
        "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600",
        "dark:hover:bg-blue-900/20 dark:hover:border-blue-600"
      ],
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="hidden sm:inline">السابق</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

// Pagination Next
const PaginationNext = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { variant?: "default" | "modern" }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      "gap-2 pr-3 pl-4 transition-all duration-300",
      variant === "modern" && [
        "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
        "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600",
        "dark:hover:bg-blue-900/20 dark:hover:border-blue-600"
      ],
      className
    )}
    {...props}
  >
    <span className="hidden sm:inline">التالي</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

// Pagination First
const PaginationFirst = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to first page"
    size="icon"
    className={cn(
      "transition-all duration-300 hover:bg-green-50 hover:border-green-300 hover:text-green-600",
      "dark:hover:bg-green-900/20 dark:hover:border-green-600",
      className
    )}
    {...props}
  >
    <StepBack className="h-4 w-4" />
  </PaginationLink>
)
PaginationFirst.displayName = "PaginationFirst"

// Pagination Last
const PaginationLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to last page"
    size="icon"
    className={cn(
      "transition-all duration-300 hover:bg-green-50 hover:border-green-300 hover:text-green-600",
      "dark:hover:bg-green-900/20 dark:hover:border-green-600",
      className
    )}
    {...props}
  >
    <StepForward className="h-4 w-4" />
  </PaginationLink>
)
PaginationLast.displayName = "PaginationLast"

// Pagination Ellipsis
const PaginationEllipsis = ({
  className,
  animated = true,
  ...props
}: React.ComponentProps<"span"> & { animated?: boolean }) => (
  <motion.span
    aria-hidden
    initial={animated ? { opacity: 0, scale: 0.8 } : {}}
    animate={animated ? { opacity: 1, scale: 1 } : {}}
    transition={{ duration: 0.3 }}
    className={cn(
      "flex h-9 w-9 items-center justify-center text-gray-400 dark:text-gray-500",
      "transition-colors duration-200 hover:text-gray-600 dark:hover:text-gray-300",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">المزيد من الصفحات</span>
  </motion.span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// Pagination Info
const PaginationInfo = ({
  className,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  ...props
}: React.ComponentProps<"div"> & {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
}) => {
  const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1
  const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={cn(
        "text-sm text-gray-600 dark:text-gray-400 text-center lg:text-right",
        "px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border",
        "border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {totalItems ? (
        <span>
          عرض {startItem}-{endItem} من أصل {totalItems} عنصر
        </span>
      ) : (
        <span>
          الصفحة {currentPage} من {totalPages}
        </span>
      )}
    </motion.div>
  )
}
PaginationInfo.displayName = "PaginationInfo"

// Enhanced Pagination Component
const EnhancedPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  variant = "modern",
  size = "md",
  showNumbers = true,
  showEdgeButtons = true,
  showInfo = true,
  onPageChange,
  className,
  ...props
}: {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
} & PaginationProps) => {
  const generatePageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      }
    }

    let prev = 0
    for (const i of range) {
      if (i - prev > 1) {
        rangeWithDots.push("...")
      }
      rangeWithDots.push(i)
      prev = i
    }

    return rangeWithDots
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {showInfo && (
        <PaginationInfo
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
      
      <Pagination variant={variant} {...props}>
        <PaginationContent>
          {showEdgeButtons && (
            <PaginationItem>
              <PaginationFirst
                onClick={() => onPageChange(1)}
                isDisabled={currentPage === 1}
              />
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationPrevious
              variant={variant}
              onClick={() => onPageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            />
          </PaginationItem>

          {showNumbers && pageNumbers.map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  onClick={() => onPageChange(pageNumber as number)}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              variant={variant}
              onClick={() => onPageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            />
          </PaginationItem>

          {showEdgeButtons && (
            <PaginationItem>
              <PaginationLast
                onClick={() => onPageChange(totalPages)}
                isDisabled={currentPage === totalPages}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
  PaginationInfo,
  EnhancedPagination,
}