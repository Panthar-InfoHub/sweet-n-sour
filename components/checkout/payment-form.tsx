"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, Banknote } from "lucide-react"

interface PaymentFormProps {
  onSubmit: (data: any) => void
  onBack: () => void
}

export function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ paymentMethod, ...formData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-4 block">Select Payment Method</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
          <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Credit / Debit Card</p>
                <p className="text-sm text-foreground-muted">Pay securely with your card</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">UPI</p>
                <p className="text-sm text-foreground-muted">Pay using UPI apps</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
              <Banknote className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-foreground-muted">Pay when you receive</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "card" && (
        <div className="space-y-4 animate-slide-down">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength={19}
            />
          </div>

          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={formData.cardName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleChange}
                maxLength={5}
              />
            </div>

            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                maxLength={3}
                type="password"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="animate-slide-down">
          <Label htmlFor="upiId">UPI ID</Label>
          <Input id="upiId" placeholder="yourname@upi" />
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary-hover">
          Continue to Review
        </Button>
      </div>
    </form>
  )
}
