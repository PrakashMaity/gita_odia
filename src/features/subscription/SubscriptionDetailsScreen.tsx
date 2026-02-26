import { Box } from '@/components/ui/box';
import { useSemanticColors } from '@/hooks/useSemanticColors';
import { initializeRevenueCat } from '@/services/revenuecat';
import type { PackageType, SubscriptionDetailsDisplay } from '@/types/subscription';
import { getPackageDisplayName } from '@/types/subscription';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Purchases from 'react-native-purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export const SubscriptionDetailsScreen: React.FC = () => {
  const { colors } = useSemanticColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [details, setDetails] = useState<SubscriptionDetailsDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const isReady = initializeRevenueCat();
      if (!isReady) {
        setError('Could not initialize subscription service.');
        setDetails(null);
        return;
      }
      const customerInfo = await Purchases.getCustomerInfo();
      const premium = customerInfo.entitlements.active['premium'];

      if (!premium) {
        setDetails({
          status: 'none',
          entitlementId: 'premium',
          productIdentifier: '',
          planName: 'No active subscription',
          expirationDate: null,
          purchaseDate: null,
          isLifetime: false,
          willRenew: false,
        });
        return;
      }

      const expDate = premium.expirationDate ?? null;
      const purchaseDate = premium.originalPurchaseDate ?? null;
      const productId = premium.productIdentifier ?? '';
      const pkgType = PACKAGE_ID_TO_TYPE[premium.productIdentifier] ?? productId;
      const planName =
        typeof pkgType === 'string' && pkgType in PACKAGE_ID_TO_TYPE
          ? getPackageDisplayName(pkgType as PackageType)
          : productId || 'Premium';

      setDetails({
        status: premium.isActive ? 'active' : 'expired',
        entitlementId: premium.identifier,
        productIdentifier: productId,
        planName,
        expirationDate: expDate ? formatDate(expDate) : null,
        purchaseDate: purchaseDate ? formatDate(purchaseDate) : null,
        isLifetime: premium.productPlanIdentifier === 'lifetime' || productId.includes('lifetime'),
        willRenew: premium.willRenew ?? false,
      });
    } catch (e: any) {
      console.error('Subscription details error:', e);
      let msg = 'Could not load subscription details.';

      if (e.code === Purchases.PURCHASES_ERROR_CODE.BILLING_UNAVAILABLE_ERROR ||
        e.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
        msg = 'Billing service unavailable. Please check your device settings.';
      } else if (e.message?.includes('Billing service unavailable')) {
        msg = 'Billing unavailable. Please ensure you are signed into the store.';
      }

      setError(msg);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleManageSubscription = async () => {
    try {
      const isReady = initializeRevenueCat();
      if (!isReady) {
        throw new Error('RevenueCat not initialized');
      }
      await Purchases.showManageSubscriptions();
    } catch {
      if (Platform.OS === 'ios') {
        Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else {
        Linking.openURL('https://play.google.com/store/account/subscriptions');
      }
    }
  };

  if (loading) {
    return (
      <View
        className="flex-1 bg-white items-center justify-center px-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <ActivityIndicator size="large" color={colors.primary600} />
        <Text className="text-typography-600 mt-4 text-sm font-medium">
          Loading details...
        </Text>
      </View>
    );
  }

  if (error && !details) {
    return (
      <View
        className="flex-1 bg-white items-center justify-center px-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text className="text-typography-900 font-bold mb-2">{error}</Text>
        <Pressable
          className="bg-typography-900 rounded-lg px-6 py-3"
          onPress={fetchDetails}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const d = details!;
  const hasActiveSubscription = d.status === 'active';

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 pt-4 pb-6 border-b border-outline-50">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-1 mb-4 active:opacity-60"
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary800} />
            <Text className="text-typography-600 font-medium">Back</Text>
          </Pressable>
          <View>
            <Text className="text-typography-900 text-3xl font-serif font-bold mb-1">My Subscription</Text>
            <Text className="text-typography-500 font-medium">Subscription Details</Text>
          </View>
        </View>

        <View className="p-6 gap-8">
          <View>
            <Box
              className={`
                    rounded-2xl border-2 p-6
                    ${hasActiveSubscription ? 'bg-background-50 border-typography-900' : 'bg-white border-outline-200'}
                `}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-typography-500 text-xs font-bold uppercase tracking-widest mb-1">Status</Text>
                  <Text
                    className={`text-xl font-bold ${hasActiveSubscription ? 'text-typography-900' : 'text-typography-400'}`}
                  >
                    {hasActiveSubscription ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${hasActiveSubscription ? 'bg-typography-900' : 'bg-outline-100'}`}
                >
                  {hasActiveSubscription
                    ? <Ionicons name="checkmark" size={18} color="white" />
                    : <Ionicons name="close" size={18} color="#a3a3a3" />}
                </View>
              </View>

              {hasActiveSubscription ? (
                <Text className="text-typography-600 font-medium leading-6">
                  You have universal access to all premium features. Thank you for your support.
                </Text>
              ) : (
                <Text className="text-typography-400 font-medium leading-6">
                  You do not have an active subscription.
                </Text>
              )}
            </Box>
          </View>

          <View>
            <Text className="text-typography-900 font-bold text-lg mb-4">Details</Text>
            <View className="border-t border-outline-100">
              <DetailRow label="Plan" value={d.planName} />
              {d.purchaseDate && <DetailRow label="Member Since" value={d.purchaseDate} />}
              {d.expirationDate && !d.isLifetime && (
                <DetailRow label={d.willRenew ? 'Renews On' : 'Expires On'} value={d.expirationDate} />
              )}
              {d.isLifetime && hasActiveSubscription && (
                <DetailRow label="Expires" value="Never (Lifetime)" />
              )}
            </View>
          </View>

          {hasActiveSubscription ? (
            <Pressable
              onPress={handleManageSubscription}
              className="border border-outline-200 rounded-xl p-4 items-center active:bg-background-50"
            >
              <Text className="text-typography-900 font-semibold">Manage Subscription</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.replace('/subscription')}
              className="bg-typography-900 rounded-xl p-4 items-center active:opacity-90"
            >
              <Text className="text-white font-semibold">View Plans</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useSemanticColors();
  return (
    <View className="flex-row justify-between py-4 border-b border-outline-100">
      <Text className="text-typography-500 font-medium">{label}</Text>
      <Text className="text-typography-900 font-semibold text-right max-w-[60%]">{value}</Text>
    </View>
  );
}
