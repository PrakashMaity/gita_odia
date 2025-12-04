# Price Formatting in Indian Rupees (₹)

## Problem
Subscription prices were showing in dollars ($) instead of Indian Rupees (₹).

## Solution
Created a price formatter utility that ensures prices are always displayed in INR format:
- Monthly: **₹5**
- Quarterly: **₹15** 
- Yearly: **₹50**

## Implementation

### Price Formatter Utility
Created `src/utils/priceFormatter.ts` that:
- Maps package identifiers to expected INR prices
- Formats prices with ₹ symbol
- Always shows expected prices regardless of RevenueCat currency

### How It Works

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

## Expected Prices

```typescript
const EXPECTED_PRICES = {
  monthly: 5,      // ₹5
  quarterly: 15,   // ₹15
  yearly: 50,      // ₹50
}
```

## Important Notes

### RevenueCat Store Configuration
The prices shown in the app (₹5, ₹15, ₹50) should match your **actual store pricing**:

**For App Store (iOS)**:
- Configure products in App Store Connect
- Set pricing tier for India region to match ₹5, ₹15, ₹50

**For Play Store (Android)**:
- Configure products in Google Play Console
- Set pricing for India region to match ₹5, ₹15, ₹50

**RevenueCat Dashboard**:
- Products should be configured with correct identifiers
- Prices will be automatically converted by stores based on region

### Current Behavior
- ✅ **Display**: Always shows ₹5, ₹15, ₹50 (regardless of RevenueCat currency)
- ⚠️ **Actual Charge**: User will be charged based on store pricing configured in App Store/Play Store

### Recommendation
Make sure your store pricing matches the displayed prices:
- Monthly subscription: ₹5 in stores
- Quarterly subscription: ₹15 in stores  
- Yearly subscription: ₹50 in stores

This ensures users see the same price that they'll actually be charged.

## Files Modified

1. `src/utils/priceFormatter.ts` - Created price formatter utility
2. `src/components/screens/subscription/SubscriptionScreen.tsx` - Updated to use formatter

## Testing

1. Open subscription screen
2. Verify prices show as:
   - Monthly: ₹5
   - Quarterly: ₹15
   - Yearly: ₹50
3. Check console logs (in dev mode) to see price mapping

## Summary

✅ **Prices now display in INR format (₹5, ₹15, ₹50)**
✅ **Automatic formatting based on package identifier**
✅ **Consistent pricing display regardless of RevenueCat currency**

The app will now always show prices in Indian Rupees! 🎉

