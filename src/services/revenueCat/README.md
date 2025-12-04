# RevenueCat Integration

This directory contains the RevenueCat integration for in-app purchases and subscriptions.

## Setup

### 1. Configure API Keys

Update the API keys in `app.config.js`:

```javascript
const REVENUECAT_CONFIG = {
  iosApiKey: 'your-ios-api-key-here',
  androidApiKey: 'your-android-api-key-here',
};
```

Or use environment variables:
```bash
REVENUECAT_IOS_API_KEY=your-ios-key
REVENUECAT_ANDROID_API_KEY=your-android-key
```

### 2. Initialize RevenueCat

RevenueCat is automatically initialized in `app/_layout.tsx` when the app starts.

### 3. Configure Products in RevenueCat Dashboard

1. Go to your RevenueCat dashboard
2. Create your products and offerings
3. Set up entitlements (e.g., "premium")
4. Configure your app's bundle identifier/package name

## Usage

### Using the Hook

The easiest way to use RevenueCat in your components is with the `useRevenueCat` hook:

```tsx
import { useRevenueCat } from '@/hooks/useRevenueCat';

function PurchaseScreen() {
  const { 
    packages, 
    isPremium, 
    isLoading, 
    purchasePackage, 
    restorePurchases 
  } = useRevenueCat();

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      await purchasePackage(pkg);
      // Purchase successful!
    } catch (error) {
      if (error.message === 'Purchase was cancelled') {
        // User cancelled
      } else {
        // Handle other errors
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View>
      {isPremium ? (
        <Text>You are a premium user!</Text>
      ) : (
        packages?.map((pkg) => (
          <Button 
            key={pkg.identifier}
            title={pkg.product.title}
            onPress={() => handlePurchase(pkg)}
          />
        ))
      )}
      <Button title="Restore Purchases" onPress={restorePurchases} />
    </View>
  );
}
```

### Using the Service Directly

For more advanced use cases, you can use the service directly:

```tsx
import { revenueCatService } from '@/services/revenueCat';

// Get offerings
const offering = await revenueCatService.getOfferings();

// Purchase a package
const packageToPurchase = offering?.availablePackages[0];
if (packageToPurchase) {
  const customerInfo = await revenueCatService.purchasePackage(packageToPurchase);
}

// Check premium status
const isPremium = await revenueCatService.isPremium();

// Restore purchases
await revenueCatService.restorePurchases();

// Set user ID
await revenueCatService.setUserId('user-123');
```

## Important Notes

1. **Entitlement Identifier**: The `isPremium()` method checks for an entitlement called "premium". Update this in `revenueCatService.ts` if you use a different entitlement identifier.

2. **Testing**: 
   - Use sandbox/test accounts for testing
   - Test purchases won't charge real money
   - For iOS, use sandbox accounts from App Store Connect
   - For Android, use test accounts from Google Play Console

3. **Building**: 
   - You need to build native apps using EAS Build (not Expo Go)
   - Run: `eas build --profile development --platform android` or `--platform ios`
   - Upload the build to your store (internal track) to test purchases

4. **Debugging**: 
   - Enable verbose logging in development: `LOG_LEVEL.VERBOSE`
   - Check logs using Console.app (iOS) or LogCat (Android)

## Next Steps

1. Replace test API keys with your actual keys from RevenueCat dashboard
2. Create products and offerings in RevenueCat dashboard
3. Test purchases in sandbox/test mode
4. Build and upload to stores for testing
5. Implement premium features using `isPremium()` checks

