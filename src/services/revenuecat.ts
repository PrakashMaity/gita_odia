import { PackageType, SubscriptionDetailsDisplay, getPackageDisplayName } from '@/types/subscription';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

let initialized = false;

const PACKAGE_ID_TO_TYPE: Record<string, PackageType> = {
  $rc_monthly: 'MONTHLY',
  $rc_annual: 'ANNUAL',
  $rc_three_month: 'THREE_MONTH',
  $rc_six_month: 'SIX_MONTH',
  $rc_lifetime: 'LIFETIME',
  $rc_weekly: 'WEEKLY',
  $rc_two_month: 'TWO_MONTH',
};

function formatDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

const REVENUECAT_API_KEYS = {
  android: __DEV__
    ? 'test_FBQtPMQntYcFvZHIQATXQUBRPDW' : 'goog_pJDbZEpNaWXfRLUADBqEJbBJpDs',
  ios: __DEV__
    ? 'test_FBQtPMQntYcFvZHIQATXQUBRPDW'
    : 'test_FBQtPMQntYcFvZHIQATXQUBRPDW',
};

const getApiKey = () => (Platform.OS === 'android'
  ? REVENUECAT_API_KEYS.android
  : REVENUECAT_API_KEYS.ios);

export const initializeRevenueCat = (): boolean => {
  if (initialized) return true;

  try {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    Purchases.configure({ apiKey: getApiKey() });
    initialized = true;
    return true;
  } catch (error) {
    console.error('RevenueCat initialization failed:', error);
    return false;
  }
};

export const isPremium = async (): Promise<boolean> => {
  try {
    initializeRevenueCat();
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active['premium'];
  } catch (e) {
    console.error('[RevenueCat] Error checking premium status:', e);
    return false;
  }
};

export const getSubscriptionDetails = async (): Promise<SubscriptionDetailsDisplay | null> => {
  try {
    initializeRevenueCat();
    const customerInfo = await Purchases.getCustomerInfo();
    const premium = customerInfo.entitlements.active['premium'];

    if (!premium) return null;

    const expDate = premium.expirationDate ?? null;
    const purchaseDate = premium.originalPurchaseDate ?? null;
    const productId = premium.productIdentifier ?? '';
    const pkgType = PACKAGE_ID_TO_TYPE[premium.productIdentifier] ?? productId;
    const planName =
      typeof pkgType === 'string' && pkgType in PACKAGE_ID_TO_TYPE
        ? getPackageDisplayName(pkgType as PackageType)
        : productId || 'Premium';

    return {
      status: premium.isActive ? 'active' : 'expired',
      entitlementId: premium.identifier,
      productIdentifier: productId,
      planName,
      expirationDate: expDate ? formatDate(expDate) : null,
      purchaseDate: purchaseDate ? formatDate(purchaseDate) : null,
      isLifetime: premium.productPlanIdentifier === 'lifetime' || productId.includes('lifetime'),
      willRenew: premium.willRenew ?? false,
    };
  } catch (e) {
    console.error('[RevenueCat] Error fetching subscription details:', e);
    return null;
  }
};
