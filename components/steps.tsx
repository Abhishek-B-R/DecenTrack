import React from "react"
import { cn } from "@/lib/utils"

interface StepsProps {
  children: React.ReactNode
  className?: string
}

interface StepProps {
  title: string
  children: React.ReactNode
  className?: string
  stepNumber?: number
  totalSteps?: number
}

export function Steps({ children, className }: StepsProps) {
  // Count the number of steps
  const stepCount = React.Children.count(children)

  // Clone children to add step number
  const stepsWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<StepProps>, {
        stepNumber: index + 1,
        totalSteps: stepCount,
      })
    }
    return child
  })

  return <div className={cn("space-y-8", className)}>{stepsWithProps}</div>
}

export function Step({
  title,
  children,
  className,
  stepNumber,
  totalSteps,
}: StepProps & { stepNumber?: number; totalSteps?: number }) {
  return (
    <div className={cn("relative", className)}>
      {stepNumber && totalSteps && stepNumber < totalSteps && (
        <div className="absolute left-3.5 top-10 bottom-0 w-px bg-muted-foreground/20" />
      )}
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-medium">
          {stepNumber}
        </div>
        <div className="space-y-1">
          <div className="font-medium">{title}</div>
          <div className="text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  )
}
