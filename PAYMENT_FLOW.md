# Payment Flow Documentation

## Overview

This document explains the improved payment flow for the e-commerce application using Razorpay. The new flow is more robust, handles edge cases better, and uses webhooks as a backup mechanism.

## Architecture

### Flow Diagram

```
User Checkout → Initiate Order → Create Order in DB (PENDING) 
    → Razorpay Modal → User Pays → Frontend Confirm 
    → Update Order (PROCESSING/FAILED) → Deduct Stock
    
Webhook (Backup) → Verify Signature → Update Order (if not already done)
```

## Key Improvements

### 1. **Order Creation During Initiation**
- **Old Approach**: Order was created only after successful payment
- **New Approach**: Order is created immediately when user clicks "Pay Now"
  - Status: `PENDING`
  - Payment Status: `PENDING`
  - Razorpay Order ID is stored
  
**Benefits**:
- If user closes the payment modal, the order still exists in DB for tracking
- No data loss if payment succeeds but frontend confirmation fails
- Better order tracking and analytics

### 2. **Simplified Confirmation**
- **Old Approach**: All order data was passed from frontend to confirmation
- **New Approach**: Only order ID and payment IDs are needed
  - Reduces data transfer
  - Prevents tampering
  - More secure

### 3. **Stock Deduction Only on Success**
- Stock is deducted ONLY when payment is confirmed as successful
- Prevents stock reservation issues
- Handles failed payments gracefully

### 4. **Webhook Backup**
- Razorpay sends webhooks for all payment events
- Acts as a backup if frontend confirmation fails
- Ensures payment state is always synchronized

### 5. **Payment Status Tracking**
- Separate `OrderStatus` and `PaymentStatus` enums
- Admin can see both order fulfillment status AND payment status
- Better visibility into payment issues

## Database Schema

### Order Model

```prisma
model Order {
  // ... existing fields
  
  status OrderStatus @default(PENDING)  // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, FAILED
  paymentStatus PaymentStatus @default(PENDING)  // PENDING, SUCCESS, FAILED, REFUNDED
  
  razorpayOrderId   String?
  razorpayPaymentId String?
  
  // Webhook tracking
  webhookReceived    Boolean   @default(false)
  webhookReceivedAt  DateTime?
  webhookEvent       String?   // e.g., payment.captured, payment.failed
  paymentFailureReason String?
}
```

## API Endpoints

### 1. Initiate Order - `actions/payment/initiate-order.ts`

**Purpose**: Validate cart, create order in DB, create Razorpay order

**Input**:
```typescript
{
  items: [
    {
      productId: string,
      name: string,
      image: string,
      variantDetails: { weight: string, price: number },
      quantity: number
    }
  ],
  shippingAddress: AddressDetails,
  billingAddress?: AddressDetails,
  couponCode?: string
}
```

**Output**:
```typescript
{
  success: true,
  data: {
    orderId: string,           // DB order ID
    orderNumber: string,       // ORD-20251012-001
    razorpayOrderId: string,   // Razorpay order ID
    key: string,               // Razorpay key for frontend
    amount: number,            // Total amount
    currency: string           // INR
  }
}
```

**Process**:
1. Validate user authentication
2. Fetch and validate products
3. Check stock availability
4. Apply coupon if provided
5. Calculate totals
6. Generate order number
7. Create Razorpay order
8. Create order in DB with PENDING status
9. Return minimal data to frontend

### 2. Confirm Order - `actions/payment/confirm-order.ts`

**Purpose**: Verify payment signature and update order status

**Input**:
```typescript
{
  orderId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}
```

**Output**:
```typescript
{
  success: true,
  data: Order,
  message: string
}
```

**Process**:
1. Verify Razorpay signature
2. If invalid → Mark order as FAILED
3. Fetch order from DB
4. Check if already processed (idempotency)
5. Update order status to PROCESSING
6. Update payment status to SUCCESS
7. Deduct stock for all items
8. Update coupon usage
9. Return updated order

### 3. Webhook Handler - `app/api/webhooks/razorpay/route.ts`

**Purpose**: Handle Razorpay webhook events as backup

**Endpoint**: `POST /api/webhooks/razorpay`

**Events Handled**:
- `payment.captured` → Update order to SUCCESS
- `payment.failed` → Update order to FAILED
- `order.paid` → Update order to SUCCESS

**Process**:
1. Verify webhook signature
2. Parse event payload
3. Find order by `razorpayOrderId`
4. Check if already processed (idempotency)
5. Update order status accordingly
6. Deduct stock if payment successful and not already deducted

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Webhook Secret (Get from Razorpay Dashboard → Webhooks)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Database Migration

Run the Prisma migration:

```bash
npx prisma migrate dev
```

This will add:
- `FAILED` to `OrderStatus` enum
- Webhook tracking fields to `Order` model

### 3. Razorpay Webhook Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **Webhooks**
3. Click **Add Webhook**
4. Configure:
   - **Webhook URL**: `https://yourdomain.com/api/webhooks/razorpay`
   - **Secret**: Generate a secret and add to `.env` as `RAZORPAY_WEBHOOK_SECRET`
   - **Events**: Select the following:
     - ✅ `payment.captured`
     - ✅ `payment.failed`
     - ✅ `order.paid`
5. Click **Create Webhook**

### 4. Test Webhook Locally

For local development, use [ngrok](https://ngrok.com/) or [localtunnel](https://localtunnel.github.io/www/):

```bash
# Using ngrok
ngrok http 3000

# Update webhook URL in Razorpay Dashboard
https://your-ngrok-url.ngrok.io/api/webhooks/razorpay
```

## Error Handling

### Frontend Payment Modal Closed

**Scenario**: User closes Razorpay modal without completing payment

**Behavior**:
- Order remains in DB with `PENDING` status
- No stock is deducted
- Admin can see pending orders in dashboard

**User Experience**:
- User can retry payment by going through checkout again
- Previous pending order can be cancelled manually by admin

### Payment Succeeds but Frontend Fails

**Scenario**: Payment completes but frontend confirmation fails (network issue, browser crash, etc.)

**Behavior**:
- Webhook receives `payment.captured` event
- Webhook updates order to `PROCESSING`
- Webhook deducts stock
- User's account shows successful order

**Safety**:
- Idempotency checks prevent double stock deduction
- Order status is verified before processing

### Payment Fails

**Scenario**: Payment fails due to insufficient funds, card issues, etc.

**Behavior**:
- Frontend marks order as `FAILED`
- Webhook also receives `payment.failed` event
- Order status: `FAILED`
- Payment status: `FAILED`
- No stock deduction occurs

## Admin Dashboard

### Order Columns

The admin orders table now shows:

| Column | Description |
|--------|-------------|
| Order Number | Unique order identifier (ORD-YYYYMMDD-XXX) |
| Customer | Customer name and email |
| Date | Order creation date |
| Items | Total quantity of items |
| Total | Order total amount |
| **Order Status** | Order fulfillment status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, FAILED) |
| **Payment Status** | Payment state (PENDING, SUCCESS, FAILED, REFUNDED) |
| Actions | View details, Update status, Cancel |

### Payment Status Colors

- 🟡 **PENDING**: Yellow - Payment not yet received
- 🟢 **SUCCESS**: Green - Payment successful
- 🔴 **FAILED**: Red - Payment failed
- ⚪ **REFUNDED**: Gray - Payment refunded

## Monitoring and Debugging

### Check Webhook Logs

Monitor webhook events in your logs:

```bash
# Check webhook events in logs
grep "Received webhook event" logs/app.log

# Check for processing errors
grep "Webhook processing error" logs/app.log
```

### Database Queries

Check orders with pending payments:

```sql
SELECT * FROM "order" 
WHERE "paymentStatus" = 'PENDING' 
AND "createdAt" < NOW() - INTERVAL '1 hour';
```

Check webhook-processed orders:

```sql
SELECT * FROM "order" 
WHERE "webhookReceived" = true
ORDER BY "webhookReceivedAt" DESC;
```

## Testing

### Test Payment Flow

1. **Happy Path**:
   - Add items to cart
   - Proceed to checkout
   - Fill address details
   - Click "Pay Now"
   - Complete payment in Razorpay modal
   - Verify order status changes to PROCESSING
   - Check stock is deducted

2. **Payment Modal Closed**:
   - Add items to cart
   - Proceed to checkout
   - Click "Pay Now"
   - Close Razorpay modal
   - Verify order remains PENDING in admin dashboard
   - Verify stock is NOT deducted

3. **Payment Failure**:
   - Add items to cart
   - Proceed to checkout
   - Use test card that fails (Razorpay test mode)
   - Verify order status is FAILED
   - Verify stock is NOT deducted

4. **Webhook Backup**:
   - Simulate frontend failure after payment
   - Check webhook processes the event
   - Verify order is updated correctly

### Test Cards (Razorpay Test Mode)

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4111111111111111 | Any 3 digits | Any future date | Success |
| 4000000000000002 | Any 3 digits | Any future date | Failure |

## Security Considerations

1. **Signature Verification**: All payment confirmations verify Razorpay signatures
2. **Webhook Authentication**: Webhooks verify signatures before processing
3. **Idempotency**: Duplicate webhook events are handled gracefully
4. **Data Validation**: All input data is validated with Zod schemas
5. **Price Verification**: Product prices are verified server-side, not trusted from frontend
6. **Stock Checks**: Stock availability is checked before order creation

## Rollback Plan

If you need to rollback:

1. Revert database migration:
```bash
npx prisma migrate rollback
```

2. Restore old files:
```bash
git checkout HEAD~1 -- actions/payment/
git checkout HEAD~1 -- app/api/webhooks/
git checkout HEAD~1 -- utils/order-helpers.ts
```

3. Regenerate Prisma client:
```bash
npx prisma generate
```

## Support and Troubleshooting

### Common Issues

**Issue**: Order stuck in PENDING status
- **Cause**: Payment completed but confirmation failed
- **Solution**: Check webhook logs, manually verify payment in Razorpay dashboard

**Issue**: Stock not deducted
- **Cause**: Order not marked as SUCCESS
- **Solution**: Check payment status, verify webhook is working

**Issue**: Webhook not receiving events
- **Cause**: Incorrect webhook URL or secret
- **Solution**: Verify webhook configuration in Razorpay dashboard

## Future Enhancements

1. **Auto-cancel pending orders** after 24 hours
2. **Retry mechanism** for failed webhooks
3. **Email notifications** for order status changes
4. **Refund handling** directly from admin panel
5. **Payment analytics** dashboard
6. **Multiple payment gateways** support

## Conclusion

This improved payment flow provides:
- ✅ Better reliability
- ✅ Edge case handling
- ✅ Webhook backup mechanism
- ✅ Improved admin visibility
- ✅ Clean, maintainable code
- ✅ Security best practices

For questions or issues, refer to the code comments or contact the development team.
