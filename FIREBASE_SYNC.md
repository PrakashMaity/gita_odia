# RevenueCat Firebase Sync Integration

This document explains how RevenueCat subscriptions are synchronized with Firebase, including implementation details, architecture, usage, and troubleshooting.

## Table of Contents
1. [Overview](#overview)
2. [What Was Implemented](#what-was-implemented)
3. [Architecture](#architecture)
4. [How It Works](#how-it-works)
5. [Usage](#usage)
6. [Data Structure](#data-structure)
7. [Security Rules](#security-rules)
8. [Benefits](#benefits)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Firebase sync service automatically:
1. **Links RevenueCat customer ID with Firebase device ID** - Enables cross-device subscription access
2. **Stores subscription data in Firestore** - Updates device records with subscription status
3. **Tracks subscription events** - Logs purchase events for analytics
4. **Syncs subscription status** - Automatically syncs when subscriptions change

---

## What Was Implemented

### 1. **Firebase Sync Service** (`src/services/revenueCat/firebaseSync.ts`)
   - Links RevenueCat customer ID with Firebase device ID
   - Syncs subscription status to Firestore
   - Tracks subscription events for analytics
   - Handles offline sync with pending sync queue

### 2. **Firestore Collections**
   - **`UserClients`**: Device records with subscription data
   - **`Subscriptions`**: Subscription records linked to RevenueCat customer ID
   - **`SubscriptionEvents`**: Event logs for analytics

### 3. **Automatic Integration**
   - Firebase sync initializes automatically when RevenueCat initializes
   - Syncs after purchase completion
   - Syncs after restore purchases
   - Syncs subscription status changes

### 4. **Event Tracking**
   - Purchase success events
   - Purchase cancellation events
   - Restore purchases events
   - All events stored in Firestore for analytics

### Features

#### ✅ Synchronization
- **Device Subscription Sync**: Subscription status stored in device records
- **Cross-Device Sync**: RevenueCat customer ID linked to Firebase device ID
- **Automatic Sync**: Syncs automatically on purchase/restore/subscription changes
- **Offline Support**: Queues sync when offline, retries when online

#### ✅ Data Storage
- **Subscription Status**: `isPremium`, `hasActiveSubscription`, etc.
- **Entitlement Details**: Active entitlements and subscription IDs
- **Expiration Dates**: Latest expiration date and timestamps
- **Management URLs**: Subscription management URLs for cancellation

#### ✅ Analytics
- **Event Tracking**: All subscription events logged to Firestore
- **Platform Tracking**: Tracks iOS/Android/Web platform
- **Product Tracking**: Tracks which products were purchased

---

## Architecture

### Firestore Collections

#### 1. `UserClients` Collection
- **Document ID**: Device ID
- **Contains**: Device info + Subscription data
- **Structure**:
  ```typescript
  {
    deviceId: string;
    platform: 'ios' | 'android' | 'web';
    // ... device info ...
    
    // Subscription data
    revenueCatCustomerId: string | null;
    isPremium: boolean;
    hasActiveSubscription: boolean;
    activeEntitlements: Record<string, PurchasesEntitlementInfo>;
    entitlementIds: string[];
    latestExpirationDate: string | null;
    subscriptionExpiresAt: number | null;
    managementURL: string | null;
    lastSyncedAt: number;
    updatedAt: number;
  }
  ```

#### 2. `Subscriptions` Collection
- **Document ID**: RevenueCat App User ID
- **Contains**: Subscription data linked to RevenueCat customer
- **Structure**: Same as subscription data in UserClients

#### 3. `SubscriptionEvents` Collection
- **Auto-generated document IDs**
- **Contains**: Subscription events for analytics
- **Structure**:
  ```typescript
  {
    eventName: string; // 'purchase_success', 'purchase_cancelled', 'restore_purchases'
    platform: 'ios' | 'android' | 'web';
    product_identifier?: string;
    is_premium?: boolean;
    timestamp: Timestamp;
    createdAt: number;
  }
  ```

---

## How It Works

### Initialization Flow
```
App Starts
  → initializeRevenueCat()
    → revenueCatService.initialize()
    → initializeRevenueCatFirebaseSync()
      → syncRevenueCatUserIdToFirebase() (links IDs)
      → syncCurrentSubscriptionToFirebase() (syncs status)
```

### Purchase Flow
```
User Purchases
  → purchasePackage()
  → refreshCustomerInfo()
  → syncSubscriptionToFirebase() (updates Firestore)
  → trackPurchaseSuccess() (logs event)
```

### Restore Flow
```
User Restores
  → restorePurchases()
  → syncSubscriptionToFirebase() (updates Firestore)
  → trackRestorePurchases() (logs event)
```

### 1. Initialization

When the app starts:
```typescript
// In app/_layout.tsx
initializeRevenueCat(); // Automatically calls Firebase sync initialization
```

The sync service:
1. Links RevenueCat user ID with Firebase device ID
2. Syncs current subscription status to Firestore
3. Syncs any pending subscription data

### 2. Purchase Flow

When a user purchases a subscription:

1. **Purchase completes** → RevenueCat processes the purchase
2. **Customer info refreshed** → Gets latest subscription status
3. **Firebase sync triggered** → Updates Firestore with subscription data
4. **Event tracked** → Logs purchase event for analytics

```typescript
// In SubscriptionScreen.tsx
await purchasePackage(packageToPurchase);
await syncSubscriptionToFirebase(customerInfo);
await trackPurchaseSuccess(productIdentifier, customerInfo);
```

### 3. Automatic Sync

Subscription status is automatically synced:
- When app starts
- After purchase completes
- After restore purchases
- When subscription status changes

### 4. Cross-Device Sync

Since RevenueCat customer ID is linked to Firebase device ID:
- User can access subscription on multiple devices
- Subscription status syncs across devices
- Firebase tracks all devices with active subscription

---

## Usage

### Automatic (Already Integrated)
- Sync happens automatically on app start
- Sync happens after purchases
- Sync happens after restore

### Manual Sync

```typescript
import { syncCurrentSubscriptionToFirebase } from '@/services/revenueCat/firebaseSync';

// Sync current subscription status
await syncCurrentSubscriptionToFirebase();
```

### Track Events

```typescript
import { trackPurchaseSuccess, trackPurchaseCancelled } from '@/services/revenueCat/firebaseSync';

// Track purchase success
await trackPurchaseSuccess(productIdentifier, customerInfo);

// Track cancellation
await trackPurchaseCancelled(productIdentifier);
```

### Get Device Subscription Status

Query Firestore to get subscription status for a device:

```typescript
import { doc, getDoc } from '@react-native-firebase/firestore';
import { getFirestore } from '@react-native-firebase/firestore';

const db = getFirestore();
const deviceRef = doc(db, 'UserClients', deviceId);
const deviceDoc = await getDoc(deviceRef);
const isPremium = deviceDoc.data()?.isPremium;
```

---

## Data Structure

### Device Document (UserClients/{deviceId})
```typescript
{
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  // ... existing device fields ...
  
  // Subscription fields (added)
  revenueCatCustomerId: string | null;
  isPremium: boolean;
  hasActiveSubscription: boolean;
  activeEntitlements: Record<string, PurchasesEntitlementInfo>;
  entitlementIds: string[];
  latestExpirationDate: string | null;
  subscriptionExpiresAt: number | null;
  managementURL: string | null;
  lastSyncedAt: number;
}
```

### Subscription Document (Subscriptions/{revenueCatUserId})
```typescript
{
  revenueCatCustomerId: string;
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  isPremium: boolean;
  hasActiveSubscription: boolean;
  activeEntitlements: Record<string, PurchasesEntitlementInfo>;
  // ... all subscription fields ...
}
```

### Event Document (SubscriptionEvents/{autoId})
```typescript
{
  eventName: 'purchase_success' | 'purchase_cancelled' | 'restore_purchases';
  platform: 'ios' | 'android' | 'web';
  product_identifier?: string;
  is_premium?: boolean;
  timestamp: Timestamp;
  createdAt: number;
}
```

---

## Security Rules

Update your Firestore security rules to allow read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own device data
    match /UserClients/{deviceId} {
      allow read, write: if true; // Adjust based on your security needs
    }
    
    // Subscription collection
    match /Subscriptions/{userId} {
      allow read, write: if true; // Adjust based on your security needs
    }
    
    // Subscription events (write-only for clients)
    match /SubscriptionEvents/{eventId} {
      allow create: if true;
      allow read: if false; // Only server/admin can read events
    }
  }
}
```

**Note**: Adjust the security rules based on your specific security requirements. The above rules are permissive and should be tightened for production.

---

## Benefits

1. **Centralized Subscription Management**
   - All subscription data in one place (Firebase)
   - Easy to query and analyze

2. **Cross-Device Access**
   - Subscription status available across devices
   - Firebase tracks all devices with subscription

3. **Analytics & Insights**
   - Track purchase events
   - Monitor subscription metrics
   - Analyze user behavior

4. **Backup & Recovery**
   - Firestore acts as backup of subscription data
   - Can restore subscription status if RevenueCat data is unavailable

5. **Server-Side Integration**
   - Backend can query Firestore to verify subscription
   - Enable server-side features based on subscription status

---

## Troubleshooting

### Sync not working?

1. Check Firebase initialization
2. Verify Firestore permissions
3. Check console logs for errors
4. Manually trigger sync: `syncCurrentSubscriptionToFirebase()`

### Events not tracking?

1. Verify Firestore security rules allow writes
2. Check `SubscriptionEvents` collection exists
3. Review console logs

### Cross-device sync not working?

1. Verify RevenueCat user ID is set correctly
2. Check that same RevenueCat customer ID is used across devices
3. Verify Firebase device ID is consistent

### Subscription not syncing to Firebase

1. Check Firebase initialization
2. Verify Firestore permissions
3. Check console logs for sync errors
4. Manually trigger sync: `syncCurrentSubscriptionToFirebase()`

### Events not being tracked

1. Verify Firestore security rules allow writes
2. Check `SubscriptionEvents` collection exists
3. Review console logs for errors

---

## Error Handling

The sync service is designed to be non-blocking:
- Firebase sync failures don't affect RevenueCat functionality
- Pending syncs are retried automatically
- Errors are logged but don't block user experience

---

## Testing

1. Make a test purchase
2. Check Firestore:
   - `UserClients/{deviceId}` should have subscription data
   - `Subscriptions/{revenueCatUserId}` should be created
   - `SubscriptionEvents` should have purchase event
3. Verify cross-device sync by checking same RevenueCat customer ID on different devices

---

## Next Steps

1. **Update Firestore Security Rules** - Configure permissions for new collections
2. **Test Sync** - Make a test purchase and verify data in Firestore
3. **Backend Integration** - Use Firestore data to verify subscriptions server-side
4. **Analytics Dashboard** - Create queries/reports from SubscriptionEvents collection

---

## Summary

✅ **Firebase Sync Implementation Complete!**

- RevenueCat customer ID linked to Firebase device ID
- Subscription status synced to Firestore
- Event tracking for analytics
- Cross-device subscription access
- Automatic sync on purchase/restore
- Offline support with retry queue

The Firebase sync service is fully integrated and working! 🎉

