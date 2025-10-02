"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Main Form Component
const Form = FormProvider

// Types
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

// Contexts
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

type FormItemContextValue = {
  id: string
}

// Form Field Component
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <div className="w-full">
        <Controller {...props} />
      </div>
    </FormFieldContext.Provider>
  )
}

// Custom Hook
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

// Form Item Component
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "compact" | "spacious"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const id = React.useId()

  const variantStyles = {
    default: "space-y-3",
    compact: "space-y-2",
    spacious: "space-y-4"
  }

  return (
    <FormItemContext.Provider value={{ id }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full transition-all duration-200",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

// Form Label Component
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean
  }
>(({ className, required = false, children, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <div className="flex items-center gap-2">
      <Label
        ref={ref}
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          "lg:text-base",
          error 
            ? "text-red-500 dark:text-red-400" 
            : "text-gray-700 dark:text-gray-300",
          "hover:text-gray-900 dark:hover:text-white",
          className
        )}
        htmlFor={formItemId}
        {...props}
      >
        {children}
      </Label>
      {required && (
        <span className="text-red-500 text-sm font-medium">*</span>
      )}
    </div>
  )
})
FormLabel.displayName = "FormLabel"

// Form Control Component
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    focusEffect?: boolean
  }
>(({ focusEffect = true, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <motion.div whileTap={{ scale: 0.995 }}>
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        className={cn(
          "w-full transition-all duration-300",
          focusEffect && "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20",
          "rounded-lg"
        )}
        {...props}
      />
    </motion.div>
  )
})
FormControl.displayName = "FormControl"

// Form Description Component
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <motion.p
      ref={ref}
      id={formDescriptionId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={cn(
        "text-xs lg:text-sm text-gray-500 dark:text-gray-400",
        "transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-300",
        "leading-relaxed",
        className
      )}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

// Form Message Component
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    type?: "error" | "warning" | "info"
  }
>(({ className, children, type = "error", ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  const typeStyles = {
    error: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    warning: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
    info: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
  }

  if (!body) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.p
        ref={ref}
        id={formMessageId}
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "text-xs lg:text-sm font-medium",
          "px-3 py-2 rounded-lg border",
          "transition-all duration-300",
          typeStyles[type],
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2">
          {type === "error" && (
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {type === "warning" && (
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {body}
        </span>
      </motion.p>
    </AnimatePresence>
  )
})
FormMessage.displayName = "FormMessage"

// Additional Components

// Form Group Component
const FormGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    columns?: 1 | 2 | 3
  }
>(({ className, columns = 1, ...props }, ref) => {
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-4 lg:gap-6",
        gridColumns[columns],
        "w-full",
        className
      )}
      {...props}
    />
  )
})
FormGroup.displayName = "FormGroup"

// Form Section Component
const FormSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    description?: string
  }
>(({ className, title, description, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "space-y-6 p-6 lg:p-8",
        "bg-white dark:bg-gray-900/50",
        "border border-gray-200 dark:border-gray-700",
        "rounded-xl shadow-sm hover:shadow-md",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )
})
FormSection.displayName = "FormSection"

// Form Actions Component
const FormActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "left" | "center" | "right" | "between"
  }
>(({ className, align = "right", ...props }, ref) => {
  const alignStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={cn(
        "flex flex-col sm:flex-row gap-3 lg:gap-4",
        "mt-6 lg:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700",
        alignStyles[align],
        "w-full",
        className
      )}
      {...props}
    />
  )
})
FormActions.displayName = "FormActions"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormGroup,
  FormSection,
  FormActions,
}