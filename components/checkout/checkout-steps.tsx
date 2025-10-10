import { Check } from "lucide-react"
import type { CheckoutStep } from "./checkout-drawer"

interface CheckoutStepsProps {
  currentStep: CheckoutStep
}

const steps = [
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-border text-foreground-muted"
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <span className={`text-xs mt-2 font-medium ${isCurrent ? "text-primary" : "text-foreground-muted"}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 -mt-6 transition-colors ${isCompleted ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
