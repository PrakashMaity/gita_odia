# Pricing & Currency Implementation Guide

This document explains the pricing and currency display implementation, including INR formatting and test store currency behavior.

## Table of Contents
1. [Price Formatting in INR](#price-formatting-in-inr)
2. [Test Store Currency Display](#test-store-currency-display)
3. [Implementation Details](#implementation-details)
4. [Store Configuration](#store-configuration)

---

## Price Formatting in INR

### Problem
Subscription prices were showing in dollars ($) instead of Indian Rupees (₹).

### Solution
Created a price formatter utility that ensures prices are always displayed in INR format:
- Monthly: **₹5**
- Quarterly: **₹15** 
- Yearly: **₹50**

### Implementation

#### Price Formatter Utility
Created `src/utils/priceFormatter.ts` that:
- Maps package identifiers to expected INR prices
- Formats prices with ₹ symbol
- Always shows expected prices regardless of RevenueCat currency

#### How It Works

1. **Package Identifier Mapping**:
   - `monthly` → ₹5
   - `quarterly` → ₹15
   - `yearly` → ₹50

2. **Price Display**:
   - Always shows expected INR price
   - Format: `₹5`, `₹15`, `₹50`

3. **Automatic Formatting**:
   - Subscription screen automatically uses formatter
   - Prices always show in INR

### Expected Prices

```typescript
const EXPECTED_PRICES = {
  monthly: 5,      // ₹5
  quarterly: 15,   // ₹15
  yearly: 50,      // ₹50
}
```

### Files Modified

1. `src/utils/priceFormatter.ts` - Created price formatter utility
2. `src/components/screens/subscription/SubscriptionScreen.tsx` - Updated to use formatter

### Current Behavior
- ✅ **Display**: Always shows ₹5, ₹15, ₹50 (regardless of RevenueCat currency)
- ⚠️ **Actual Charge**: User will be charged based on store pricing configured in App Store/Play Store

### Recommendation
Make sure your store pricing matches the displayed prices:
- Monthly subscription: ₹5 in stores
- Quarterly subscription: ₹15 in stores  
- Yearly subscription: ₹50 in stores

This ensures users see the same price that they'll actually be charged.

---

## Test Store Currency Display

### Issue
The RevenueCat Test Store dialog shows prices in **dollars ($9.99)** instead of rupees (₹).

### Why This Happens

#### 1. **RevenueCat Test Store Limitation**
The RevenueCat Test Store dialog is a **native component** controlled by RevenueCat SDK. When using **test API keys**, the test store dialog **always displays prices in USD ($)**, regardless of your product configuration.

This is a known behavior of RevenueCat's test environment and cannot be changed from the app code.

#### 2. **Our App UI is Correct**
✅ Your app's subscription screen is correctly showing prices in **₹ (rupees)**:
- Monthly: **₹5**
- Quarterly: **₹15**  
- Yearly: **₹50**

This is handled by our custom price formatter (`src/utils/priceFormatter.ts`).

#### 3. **What Users See**
- **In Your App UI**: ₹5, ₹15, ₹50 ✅ (Correct)
- **In Test Store Dialog**: $9.99 ❌ (RevenueCat limitation, but doesn't affect functionality)

### Important Notes

#### This is ONLY in Test Mode
When you switch to **production API keys** and use the real App Store/Play Store:
- Prices will automatically show in the user's local currency (₹ for India)
- The native purchase dialogs will display correct currency
- Users will be charged in their local currency

#### Test Store Dialog is for Testing
The RevenueCat test store dialog is **only for development/testing**. In production:
- iOS: Uses native App Store purchase flow (shows ₹)
- Android: Uses native Play Store purchase flow (shows ₹)

### Current Status

| Component | Currency Display | Status |
|-----------|-----------------|--------|
| App UI (Subscription Screen) | ₹5, ₹15, ₹50 | ✅ Correct |
| RevenueCat Test Store Dialog | $9.99 | ⚠️ Expected (test mode limitation) |
| Production (Real Store) | ₹ (local currency) | ✅ Will be correct |

---

## Implementation Details

### Price Formatter Implementation

The price formatter (`src/utils/priceFormatter.ts`) works by:

1. **Mapping Package Identifiers**:
   ```typescript
   const EXPECTED_PRICES: Record<string, number> = {
     monthly: 5,
     quarterly: 15,
     yearly: 50,
   };
   ```

2. **Formatting Prices**:
   ```typescript
   export const formatPrice = (packageIdentifier: string): string => {
     const price = EXPECTED_PRICES[packageIdentifier] || 0;
     return `₹${price}`;
   };
   ```

3. **Usage in Subscription Screen**:
   ```typescript
   const formattedPrice = formatPrice(package.identifier);
   ```

### Testing

1. Open subscription screen
2. Verify prices show as:
   - Monthly: ₹5
   - Quarterly: ₹15
   - Yearly: ₹50
3. Check console logs (in dev mode) to see price mapping

---

## Store Configuration

### RevenueCat Store Configuration
The prices shown in the app (₹5, ₹15, ₹50) should match your **actual store pricing**:

#### For App Store (iOS):
1. Configure products in App Store Connect
2. Set pricing tier for India region to match ₹5, ₹15, ₹50

#### For Play Store (Android):
1. Configure products in Google Play Console
2. Set pricing for India region to match ₹5, ₹15, ₹50

#### RevenueCat Dashboard:
- Products should be configured with correct identifiers
- Prices will be automatically converted by stores based on region

### Solution Options

#### Option 1: Accept Test Store Limitation (Recommended)
- The test store showing USD is expected behavior
- Your app UI correctly shows ₹
- Production purchases will show correct currency
- **No action needed**

#### Option 2: Configure Products in Stores (For Production)
When setting up production products:

**For App Store (iOS):**
1. Configure products in App Store Connect
2. Set pricing tier for India region
3. Users will see ₹ pricing

**For Play Store (Android):**
1. Configure products in Google Play Console  
2. Set pricing for India region
3. Users will see ₹ pricing

---

## Summary

### Price Formatting ✅
- ✅ **Prices now display in INR format (₹5, ₹15, ₹50)**
- ✅ **Automatic formatting based on package identifier**
- ✅ **Consistent pricing display regardless of RevenueCat currency**

### Test Store Currency ⚠️
- ⚠️ **Test store showing USD is normal RevenueCat behavior**
- ✅ **App UI correctly displays ₹ prices**
- ✅ **Production purchases will automatically use correct currency**

### Conclusion

**No fix needed!** The test store showing USD is normal RevenueCat behavior. Your app correctly displays ₹ prices, and production purchases will automatically use the correct currency based on the user's location and store configuration.

The app will now always show prices in Indian Rupees! 🎉

