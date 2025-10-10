"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { OrderReview } from "@/components/checkout/order-review"
import { OrderSuccess } from "@/components/checkout/order-success"

interface CheckoutDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type CheckoutStep = "shipping" | "payment" | "review" | "success"

export function CheckoutDrawer({ open, onOpenChange }: CheckoutDrawerProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingData, setShippingData] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)

  const handleShippingSubmit = (data: any) => {
    setShippingData(data)
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data)
    setCurrentStep("review")
  }

  const handleOrderConfirm = () => {
    // Here you would process the order
    setCurrentStep("success")
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after animation completes
    setTimeout(() => {
      setCurrentStep("shipping")
      setShippingData(null)
      setPaymentData(null)
    }, 300)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Checkout</SheetTitle>
        </SheetHeader>

        {currentStep !== "success" && <CheckoutSteps currentStep={currentStep} />}

        <div className="mt-8">
          {currentStep === "shipping" && <ShippingForm onSubmit={handleShippingSubmit} />}
          {currentStep === "payment" && (
            <PaymentForm onSubmit={handlePaymentSubmit} onBack={() => setCurrentStep("shipping")} />
          )}
          {currentStep === "review" && (
            <OrderReview
              shippingData={shippingData}
              paymentData={paymentData}
              onConfirm={handleOrderConfirm}
              onBack={() => setCurrentStep("payment")}
            />
          )}
          {currentStep === "success" && <OrderSuccess onClose={handleClose} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}
