# Subscription Flow Implementation Plan

## Overview
Implementing a subscription flow with:
1. "Go to Pro" button in Profile/Settings page
2. Subscription screen showing plans: Monthly (₹5), Quarterly (₹15), Yearly (₹50)
3. Purchase flow using RevenueCat
4. PRO status management across the app

## Step-by-Step Implementation

### Step 1: Add "Go to Pro" Button in ProfileScreen ✅
- Add a new SettingsSection for "Subscription" 
- Add SettingsItem with "Go to Pro" button
- Navigate to subscription screen on press

### Step 2: Create Subscription Screen
- Create `/app/subscription.tsx` route
- Create subscription screen component with:
  - Header showing "Upgrade to PRO"
  - Three subscription plan cards (Monthly, Quarterly, Yearly)
  - Price display (₹5, ₹15, ₹50)
  - "Subscribe" buttons for each plan
  - Loading states
  - Success/Error handling

### Step 3: Map RevenueCat Packages
- Use `useRevenueCat` hook to fetch packages
- Map packages to plans:
  - `monthly` → Monthly (₹5)
  - `yearly` → Quarterly (₹15) - Note: Need to check RevenueCat dashboard for quarterly identifier
  - `lifetime` → Yearly (₹50) - Note: Need to verify package identifiers

### Step 4: Purchase Flow
- Implement purchase handler using `purchasePackage()`
- Show loading during purchase
- Handle success: show success message, refresh PRO status
- Handle errors: show error message, handle cancellations

### Step 5: PRO Status Management
- Create hook `useProStatus()` to check premium status
- Use RevenueCat's `isPremium()` method
- Can be used throughout app to enable/disable PRO features

## Files to Create/Modify

### New Files:
1. `app/subscription.tsx` - Subscription screen route
2. `src/components/screens/subscription/SubscriptionScreen.tsx` - Main subscription screen
3. `src/components/screens/subscription/components/SubscriptionPlanCard.tsx` - Plan card component
4. `src/components/screens/subscription/SubscriptionScreen.styles.ts` - Styles
5. `src/hooks/useProStatus.ts` - Hook for checking PRO status

### Modified Files:
1. `src/components/screens/profile/ProfileScreen.tsx` - Add "Go to Pro" button
2. `src/i18n/translation.json` - Add subscription translations

## Next Steps

Let's start implementing! 🚀

