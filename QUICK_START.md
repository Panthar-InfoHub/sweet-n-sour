# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run Migration

```bash
npx prisma migrate dev --name add_site_config
```

### Step 2: Access Admin Settings

1. Login as admin
2. Go to `/admin/settings`
3. Configure your settings
4. Click "Save Settings"

### Step 3: Test Everything

Visit any product page to see improved reviews!

---

## 📸 Visual Guide

### Product Reviews - Before vs After

**BEFORE:**

```
┌────────────────────────────────────────────────────┐
│  👤 John Doe                      ⭐⭐⭐⭐⭐      │
│  2 days ago                                        │
│                                                    │
│  Great product! Really enjoyed it.                 │
│  Highly recommend to everyone.                     │
│                                                    │
│  [ 👍 Helpful ]                                    │
│                                                    │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│  👤 Jane Smith                    ⭐⭐⭐⭐⭐      │
│  3 days ago                                        │
│                                                    │
│  Excellent quality and fast shipping!              │
│                                                    │
│  [ 👍 Helpful ]                                    │
│                                                    │
└────────────────────────────────────────────────────┘
... (all reviews visible)
```

**AFTER:**

```
┌──────────────────┐  Sort: [Newest First ▼]
│  Reviews (45)    │
└──────────────────┘

┌───────────────────────────────────────┐
│ 👤 John    ⭐⭐⭐⭐⭐               │
│ 2 days ago                            │
│ Great product! Really enjoyed it.     │
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│ 👤 Jane    ⭐⭐⭐⭐⭐               │
│ 3 days ago                            │
│ Excellent quality and fast shipping!  │
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│ 👤 Mike    ⭐⭐⭐⭐                 │
│ 5 days ago                            │
│ Good value for money.                 │
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│ 👤 Sarah   ⭐⭐⭐⭐⭐               │
│ 1 week ago                            │
│ Perfect! Will buy again.              │
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│ 👤 Tom     ⭐⭐⭐⭐                 │
│ 1 week ago                            │
│ Nice product overall.                 │
└───────────────────────────────────────┘

    [< Previous]  [1] [2] [3] ... [9]  [Next >]
```

**Key Changes:**

- ✅ Compact cards (smaller, less padding)
- ✅ No "Helpful" button
- ✅ 5 reviews per page
- ✅ Sort dropdown
- ✅ Pagination controls
- ✅ Scrollable (max 600px height)

---

### Admin Settings Page

```
┌─────────────────────────────────────────────────┐
│  Site Settings                                  │
│  Manage shipping charges, announcement bar,     │
│  and other site configurations                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Shipping Configuration                         │
│  Set shipping charges and free shipping         │
│  threshold                                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Shipping Settings                              │
│  ┌───────────────────────────────────────────┐ │
│  │ Shipping Charge (₹)                       │ │
│  │ ┌─────────────────────────────────────┐   │ │
│  │ │ 50                                  │   │ │
│  │ └─────────────────────────────────────┘   │ │
│  │ Default shipping charge for orders         │ │
│  │ below minimum                              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Free Shipping Minimum Order (₹)           │ │
│  │ ┌─────────────────────────────────────┐   │ │
│  │ │ 500                                 │   │ │
│  │ └─────────────────────────────────────┘   │ │
│  │ Orders above this amount get free          │ │
│  │ shipping                                   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ────────────────────────────────────────────  │
│                                                 │
│  Announcement Bar                               │
│  ┌───────────────────────────────────────────┐ │
│  │ Show Announcement Bar         [✓]         │ │
│  │ Display announcement bar at the top of    │ │
│  │ the site                                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Announcement Text                         │ │
│  │ ┌─────────────────────────────────────┐   │ │
│  │ │ Free shipping on orders above       │   │ │
│  │ │ ₹500!                               │   │ │
│  │ └─────────────────────────────────────┘   │ │
│  │ Text to display in the announcement bar   │ │
│  │ (max 200 characters)                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [ Save Settings ]  [ Reset ]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Checkout - Dynamic Shipping

**Scenario 1: Order Total = ₹350**

```
┌──────────────────────────┐
│  Order Summary           │
├──────────────────────────┤
│  Subtotal:     ₹350.00   │
│  Discount:      ₹0.00    │
│  Shipping:      ₹50.00   │ ← From site config
├──────────────────────────┤
│  Total:        ₹400.00   │
└──────────────────────────┘

💡 Add ₹150 more for free shipping!
```

**Scenario 2: Order Total = ₹550**

```
┌──────────────────────────┐
│  Order Summary           │
├──────────────────────────┤
│  Subtotal:     ₹550.00   │
│  Discount:      ₹0.00    │
│  Shipping:        FREE   │ ← Calculated dynamically
├──────────────────────────┤
│  Total:        ₹550.00   │
└──────────────────────────┘

🎉 You qualified for free shipping!
```

---

### Announcement Bar - Toggle Effect

**When Enabled:**

```
┌─────────────────────────────────────────────────┐
│  Free shipping on orders above ₹500! 🎉         │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  🏠 Logo            Products  About  Contact    │
└─────────────────────────────────────────────────┘
```

**When Disabled:**

```
┌─────────────────────────────────────────────────┐
│  🏠 Logo            Products  About  Contact    │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Common Use Cases

### Use Case 1: Seasonal Promotion

**Goal:** Free shipping for all orders during festival

**Steps:**

1. Go to `/admin/settings`
2. Change "Free Shipping Minimum Order" to `0`
3. Change announcement to "Festival Sale: FREE Shipping on ALL orders! 🎊"
4. Enable announcement bar
5. Save settings

**Result:** All orders get free shipping, announcement visible

---

### Use Case 2: Increase Order Value

**Goal:** Encourage larger orders

**Steps:**

1. Go to `/admin/settings`
2. Change "Free Shipping Minimum Order" to `1000`
3. Change "Shipping Charge" to `100`
4. Update announcement: "Free shipping on orders above ₹1000!"
5. Save settings

**Result:**

- Orders < ₹1000 pay ₹100 shipping
- Orders ≥ ₹1000 get free shipping
- Customers see new threshold

---

### Use Case 3: Hide Promotions

**Goal:** Remove announcement bar temporarily

**Steps:**

1. Go to `/admin/settings`
2. Toggle "Show Announcement Bar" OFF
3. Save settings

**Result:** Announcement bar hidden site-wide

---

## 📋 Quick Reference

### Default Values (First Time)

```
Shipping Charge:          ₹50
Free Shipping Minimum:    ₹500
Show Announcement:        ✓ Enabled
Announcement Text:        "Free shipping on orders above ₹500!"
```

### Review Pagination Settings

```
Reviews Per Page:         5
Max Height:              600px
Default Sort:            Newest First
```

### Admin Access

```
URL:                     /admin/settings
Required Role:           ADMIN
Auto-Create Config:      Yes (on first visit)
```

---

## ⚡ Quick Commands

```bash
# Create database table
npx prisma migrate dev --name add_site_config

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio

# Reset and reseed (if needed)
npx prisma migrate reset
npx prisma db seed
```

---

## 🎓 Pro Tips

### Tip 1: Test Before Going Live

Change settings on staging first, verify checkout works correctly

### Tip 2: Monitor Impact

Track order values after changing free shipping threshold

### Tip 3: Seasonal Updates

Use announcement bar for limited-time promotions

### Tip 4: Clear Communication

Keep announcement text short and action-oriented

### Tip 5: Backup Settings

Take note of current values before major changes

---

## ✅ Success Checklist

After setup, verify:

- [ ] Can access `/admin/settings` as admin
- [ ] Settings form loads with default values
- [ ] Can change shipping charge and save
- [ ] Can change free shipping minimum and save
- [ ] Can toggle announcement bar on/off
- [ ] Can update announcement text
- [ ] Announcement bar shows/hides based on toggle
- [ ] Custom text displays in announcement bar
- [ ] Checkout calculates shipping correctly
- [ ] Order < minimum shows shipping charge
- [ ] Order ≥ minimum shows FREE shipping
- [ ] Product reviews show 5 per page
- [ ] Pagination buttons work
- [ ] Sort dropdown changes review order
- [ ] Reviews scroll when > 5 exist
- [ ] No "Helpful" button visible

---

## 🆘 Need Help?

Check these documents:

1. `COMPLETE_GUIDE.md` - Comprehensive guide
2. `IMPLEMENTATION_SUMMARY.md` - Technical details
3. `FILTER_FIXES.md` - Product filter changes

Or contact support!

---

**That's it! You're all set! 🎉**
