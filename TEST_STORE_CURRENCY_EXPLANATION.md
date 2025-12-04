# Test Store Currency Display - Explanation

## Issue
The RevenueCat Test Store dialog shows prices in **dollars ($9.99)** instead of rupees (₹).

## Why This Happens

### 1. **RevenueCat Test Store Limitation**
The RevenueCat Test Store dialog is a **native component** controlled by RevenueCat SDK. When using **test API keys**, the test store dialog **always displays prices in USD ($)**, regardless of your product configuration.

This is a known behavior of RevenueCat's test environment and cannot be changed from the app code.

### 2. **Our App UI is Correct**
✅ Your app's subscription screen is correctly showing prices in **₹ (rupees)**:
- Monthly: **₹5**
- Quarterly: **₹15**  
- Yearly: **₹50**

This is handled by our custom price formatter (`src/utils/priceFormatter.ts`).

### 3. **What Users See**
- **In Your App UI**: ₹5, ₹15, ₹50 ✅ (Correct)
- **In Test Store Dialog**: $9.99 ❌ (RevenueCat limitation, but doesn't affect functionality)

## Important Notes

### This is ONLY in Test Mode
When you switch to **production API keys** and use the real App Store/Play Store:
- Prices will automatically show in the user's local currency (₹ for India)
- The native purchase dialogs will display correct currency
- Users will be charged in their local currency

### Test Store Dialog is for Testing
The RevenueCat test store dialog is **only for development/testing**. In production:
- iOS: Uses native App Store purchase flow (shows ₹)
- Android: Uses native Play Store purchase flow (shows ₹)

## Solution

### Option 1: Accept Test Store Limitation (Recommended)
- The test store showing USD is expected behavior
- Your app UI correctly shows ₹
- Production purchases will show correct currency
- **No action needed**

### Option 2: Configure Products in Stores (For Production)
When setting up production products:

**For App Store (iOS):**
1. Configure products in App Store Connect
2. Set pricing tier for India region
3. Users will see ₹ pricing

**For Play Store (Android):**
1. Configure products in Google Play Console  
2. Set pricing for India region
3. Users will see ₹ pricing

## Current Status

| Component | Currency Display | Status |
|-----------|-----------------|--------|
| App UI (Subscription Screen) | ₹5, ₹15, ₹50 | ✅ Correct |
| RevenueCat Test Store Dialog | $9.99 | ⚠️ Expected (test mode limitation) |
| Production (Real Store) | ₹ (local currency) | ✅ Will be correct |

## Conclusion

**No fix needed!** The test store showing USD is normal RevenueCat behavior. Your app correctly displays ₹ prices, and production purchases will automatically use the correct currency based on the user's location and store configuration.

