"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/utils/format";
import { ShoppingBag, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PhoneInput } from "@/components/ui/phone-input";
import Script from "next/script";
import { useSession } from "@/lib/auth-client";
import { checkoutFormSchema, type CheckoutFormData } from "@/lib/zod-schema";
import { z } from "zod";
import { validateCoupon } from "@/actions/admin/coupon.actions";
import { initiateOrder } from "@/actions/payment/initiate-order";
import { confirmOrder } from "@/actions/payment/confirm-order";
import { DeletePendingOrder } from "@/actions/payment/delete-pending-order";
import { FailedOrder } from "@/actions/payment/failed-order";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCouponApplying, setIsCouponApplying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "initiating" | "verifying" | "success"
  >("idle");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(
    null
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: session?.user?.email || "",
    address: "",
    apartment: "",
    country: "India",
    state: "",
    city: "",
    pinCode: "",
    coupon: "",
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-muted p-6 mb-4 inline-block">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items to your cart to checkout</p>
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      checkoutFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof CheckoutFormData;
          if (!fieldErrors[field]) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form");
      }
      return false;
    }
  };

  const handleApplyCoupon = async () => {
    if (!formData.coupon || formData.coupon.trim() === "") {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsCouponApplying(true);
    try {
      const userId = session?.user?.id;
      const result = await validateCoupon(formData.coupon, getSubtotal(), userId);

      if (result.success && result.data) {
        setAppliedCoupon({
          code: result.data.code,
          discount: result.data.discount,
        });
        toast.success(
          `Coupon "${result.data.code}" applied! You saved ${formatPrice(result.data.discount)}`
        );
      } else {
        toast.error(result.error || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to validate coupon");
    } finally {
      setIsCouponApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setFormData((prev) => ({ ...prev, coupon: "" }));
    toast.success("Coupon removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("initiating");

    try {
      const addressDetails = {
        country: formData.country,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment || undefined,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        phone: formData.phone,
        email: formData.email || undefined,
      };

      // Calculate totals
      const subtotal = getSubtotal();
      const shippingFee = getShipping();
      const discount = appliedCoupon?.discount || 0;
      const total = subtotal + shippingFee - discount;

      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        variantDetails: {
          weight: item.weight,
          price: item.price,
        },
        quantity: item.quantity,
      }));

      const orderData = {
        couponCode: appliedCoupon?.code || formData.coupon || undefined,
        items: orderItems,
        shippingAddress: addressDetails,
        billingAddress: addressDetails,
      };

      // Initiate order - this creates the order in DB with PENDING status
      const res = await initiateOrder(orderData);

      if (!res.success || !res.data) {
        throw new Error("Failed to initiate payment");
      }

      const { orderId, razorpayOrderId, key, amount } = res.data;

      // Track if payment was attempted (prevents deletion on dismiss after failed payment)
      let paymentAttempted = false;

      const options = {
        key,
        amount: amount * 100,
        order_id: razorpayOrderId,
        retry: false,
        handler: async (response: any) => {
          try {
            paymentAttempted = true;
            setPaymentStatus("verifying");
            const result = await confirmOrder({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.success) {
              setPaymentStatus("success");
              toast.success("Payment successful!", { id: "payment" });
              clearCart();
              router.push("/account/orders");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            console.error("Error confirming order:", error);
            toast.error(error.message || "Payment verification failed. Please contact support.", {
              id: "payment",
            });
            setPaymentStatus("idle");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: async () => {
            // IMPORTANT: Only delete order if payment was NOT attempted
            // This prevents deletion when:
            // 1. Payment fails (paymentAttempted will be true)
            // 2. Payment succeeds but user closes confirmation
            // 3. Any payment attempt was made

            if (!paymentAttempted) {
              // User closed modal WITHOUT attempting payment
              // Safe to delete the pending order
              console.log("User cancelled payment before attempting - deleting order");
              const result = await DeletePendingOrder(orderId);

              if (result.success) {
                toast.error("Payment cancelled", { id: "payment" });
              } else {
                // This shouldn't happen, but handle gracefully

                toast.error("Payment cancelled", { id: "payment" });
              }
            } else {
              // Payment was attempted - DO NOT delete order
              // Order status is already updated by payment.failed or handler
              console.log("Payment was attempted - keeping order for records");
              toast.error("Payment window closed. Check your orders for status.", {
                id: "payment",
              });
            }

            setPaymentStatus("idle");
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure - mark order as FAILED, don't delete
      rzp.on("payment.failed", async function (response: any) {
        paymentAttempted = true; // Mark that payment was attempted
        console.log("Payment failed, marking order as FAILED");
        await FailedOrder(orderId);
        toast.error("Payment failed.", { id: "payment" });
        setPaymentStatus("idle");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast.error(error.message || "Failed to process order. Please try again.", { id: "payment" });
      setPaymentStatus("idle");
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container-custom">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_480px] gap-8">
            {/* Left Column - Delivery Form */}
            <div className="space-y-6">
              <Card className="p-6 space-y-2">
                <h2 className="text-xl font-semibold">Delivery</h2>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                {/* Phone and Email */}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <PhoneInput
                      id="phone"
                      value={formData.phone}
                      defaultCountry="IN"
                      onChange={(value) => handleInputChange("phone", value)}
                      required
                    />
                  </div>
                  {/* Email (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                {/* Country/Region */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country/Region</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    defaultValue={"India"}
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="House number and street name"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                {/* Apartment */}
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="apartment"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange("apartment", e.target.value)}
                  />
                </div>

                {/* City, State, PIN */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pinCode">PIN code</Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange("pinCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                {/* <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div> */}
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-8 h-fit space-y-6">
              <Card className="p-6 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg border overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <div className="flex gap-4">
                          <p className="text-xs text-muted-foreground ">{item.weight}</p>
                          <p className="text-xs text-muted-foreground ">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon */}
                {appliedCoupon ? (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            Discount: {formatPrice(appliedCoupon.discount)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={formData.coupon}
                        onChange={(e) => handleInputChange("coupon", e.target.value.toUpperCase())}
                        disabled={isCouponApplying}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0"
                        onClick={handleApplyCoupon}
                        disabled={isCouponApplying || !formData.coupon}
                      >
                        {isCouponApplying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal • {items.length} item{items.length > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">{formatPrice(getSubtotal())}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-medium">Discount ({appliedCoupon.code})</span>
                      <span className="font-medium">-{formatPrice(appliedCoupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">
                      {getShipping() === 0 ? "FREE" : formatPrice(getShipping())}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-semibold pt-2">
                    <span>Total</span>
                    <span>
                      {formatPrice(getSubtotal() - (appliedCoupon?.discount || 0) + getShipping())}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
                  size="lg"
                >
                  {paymentStatus === "initiating" && (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initiating Payment...
                    </>
                  )}
                  {paymentStatus === "verifying" && (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Payment...
                    </>
                  )}
                  {paymentStatus === "success" && (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Success! Redirecting...
                    </>
                  )}
                  {paymentStatus === "idle" && "Pay Now"}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
