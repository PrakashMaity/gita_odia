import { initializeRevenueCat } from '@/services/revenuecat';
import { useProStore } from '@/store/proStore';
import { useSettingsStore } from '@/store/settingsStore';
import {
  type PackageType,
  type Plan,
  PACKAGE_TYPE_ORDER,
  getPackageDisplayName,
  getPeriodText,
} from '@/types/subscription';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Purchases from 'react-native-purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SubscriptionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  const refreshProStatus = useProStore((state) => state.refreshProStatus);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const skipSubscription = async () => {
    updateSetting('onboardingCompleted', true);
  };

  const calculateSavings = (allPlans: Plan[], currentPlan: Plan): string | undefined => {
    if (!currentPlan.package || currentPlan.packageType === 'LIFETIME') return undefined;

    const monthlyPlan = allPlans.find((p) => p.packageType === 'MONTHLY');
    if (!monthlyPlan || !monthlyPlan.package) return undefined;

    const monthlyPrice = monthlyPlan.pricePerMonth;
    const currentPricePerMonth = currentPlan.pricePerMonth;

    if (currentPricePerMonth < monthlyPrice) {
      const savingsPercent = Math.round(
        ((monthlyPrice - currentPricePerMonth) / monthlyPrice) * 100
      );
      return `${savingsPercent}% OFF`;
    }

    return undefined;
  };

  const parseOfferings = (offerings: any): Plan[] => {
    if (!offerings.current) {
      console.warn('No current offering available');
      return [];
    }

    const currentOffering = offerings.current;
    const parsedPlans: Plan[] = [];
    const packages = currentOffering.availablePackages || [];

    const sortedPackages = packages.sort((a: any, b: any) => {
      const aIndex = PACKAGE_TYPE_ORDER.indexOf(a.packageType as PackageType);
      const bIndex = PACKAGE_TYPE_ORDER.indexOf(b.packageType as PackageType);
      return aIndex - bIndex;
    });

    sortedPackages.forEach((pkg: any) => {
      if (!pkg.product) return;

      const product = pkg.product;
      const packageType = pkg.packageType as PackageType;
      const price = product.priceString || '$0.00';
      const pricePerMonth = product.pricePerMonth || 0;
      const pricePerYear = product.pricePerYear || 0;

      const plan: Plan = {
        id: pkg.identifier,
        name: product.title || getPackageDisplayName(packageType),
        price: price,
        period: getPeriodText(packageType, product),
        package: pkg,
        pricePerMonth: pricePerMonth,
        pricePerYear: pricePerYear,
        packageType: packageType,
      };

      parsedPlans.push(plan);
    });

    parsedPlans.forEach((plan) => {
      plan.savings = calculateSavings(parsedPlans, plan);
    });

    const annualPlan = parsedPlans.find((p) => p.packageType === 'ANNUAL');
    if (annualPlan && annualPlan.savings) {
      annualPlan.popular = true;
    }

    return parsedPlans;
  };

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      const isReady = initializeRevenueCat();
      if (!isReady) {
        Alert.alert('Error', 'Subscription is not available right now. Please try again later.');
        return;
      }
      const fetchedOfferings = await Purchases.getOfferings();
      if (fetchedOfferings.current) {
        const parsedPlans = parseOfferings(fetchedOfferings);
        setPlans(parsedPlans);
        if (parsedPlans.length > 0 && !selectedPlan) {
          setSelectedPlan(parsedPlans[0].id);
        }
      }
    } catch (e: any) {
      console.error('Error loading offerings:', e);

      // Determine more specific error messages
      let errorTitle = 'Error';
      let errorMessage = 'Failed to load subscription plans. Please try again later.';

      if (e.code === Purchases.PURCHASES_ERROR_CODE.BILLING_UNAVAILABLE_ERROR ||
        e.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
        errorTitle = 'Billing Unavailable';
        errorMessage = 'Billing service is unavailable on this device. This can happen if you are not signed into the Play Store/App Store, or if in-app purchases are restricted in settings.';
      } else if (e.message?.includes('Billing service unavailable') || e.message?.includes('BILLING_UNAVAILABLE')) {
        errorTitle = 'Billing Restricted';
        errorMessage = 'Billing is currently unavailable on this device. If you are using an emulator, please ensure you have Play Store installed and are signed in.';
      }

      Alert.alert(errorTitle, errorMessage, [
        { text: 'Retry', onPress: fetchOfferings },
        { text: 'OK', style: 'cancel' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    const selectedPlanData = plans.find((p) => p.id === selectedPlan);
    if (!selectedPlanData || !selectedPlanData.package) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    try {
      setPurchasing(true);
      const { customerInfo } = await Purchases.purchasePackage(selectedPlanData.package);

      if (customerInfo.entitlements.active['premium']) {
        await refreshProStatus(); // Synchronize global state immediately
        await skipSubscription();
        setTimeout(() => router.replace('/(tabs)'), 100);
      }
    } catch (e: unknown) {
      const err = e as any;
      if (err.code !== Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        Alert.alert('Purchase Failed', err.message || 'An error occurred during purchase');
      }
    } finally {
      setPurchasing(false);
    }
  };

  useEffect(() => {
    fetchOfferings();
  }, []);

  if (loading) {
    return (
      <View
        className="flex-1 bg-white items-center justify-center p-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <ActivityIndicator size="large" color="#d97706" />
        <Text className="text-typography-600 mt-4 text-base">
          Loading plans...
        </Text>
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View
        className="flex-1 bg-white p-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="flex-row justify-end mb-8">
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="w-10 h-10 rounded-full bg-background-50 justify-center items-center active:opacity-70"
          >
            <Ionicons name="close" size={24} color="#92400e" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-center mb-8">
            <Ionicons name="cloud-offline-outline" size={64} color="#d97706" />
            <Text className="text-typography-900 font-bold text-center mt-4 text-xl">
              Unable to load plans
            </Text>
            <Text className="text-typography-500 text-center mt-2 text-base">
              We couldn't retrieve the subscription options from the store.
            </Text>
          </View>

          <View className="bg-background-50 rounded-2xl p-6 mb-8">
            <Text className="text-typography-900 font-bold mb-4 text-lg">Troubleshooting</Text>

            <View className="flex-row gap-3 mb-4">
              <View className="w-6 h-6 rounded-full bg-primary-100 items-center justify-center">
                <Text className="text-primary-600 font-bold text-xs">1</Text>
              </View>
              <Text className="flex-1 text-typography-600 text-sm">
                Ensure you are signed into the Google Play Store or Apple App Store.
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="w-6 h-6 rounded-full bg-primary-100 items-center justify-center">
                <Text className="text-primary-600 font-bold text-xs">2</Text>
              </View>
              <Text className="flex-1 text-typography-600 text-sm">
                Check your internet connection and verify VPNs are disabled.
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="w-6 h-6 rounded-full bg-primary-100 items-center justify-center">
                <Text className="text-primary-600 font-bold text-xs">3</Text>
              </View>
              <Text className="flex-1 text-typography-600 text-sm">
                Verify that in-app purchases are not restricted in your device settings.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <View className="w-6 h-6 rounded-full bg-primary-100 items-center justify-center">
                <Text className="text-primary-600 font-bold text-xs">4</Text>
              </View>
              <Text className="flex-1 text-typography-600 text-sm">
                If using an emulator, ensure Google Play Services is installed and updated.
              </Text>
            </View>
          </View>

          <Pressable
            className="bg-primary-600 h-14 rounded-xl items-center justify-center active:bg-primary-700"
            onPress={fetchOfferings}
          >
            <Text className="text-white font-bold text-base">Try Again</Text>
          </Pressable>

          <Pressable
            className="h-14 items-center justify-center mt-2"
            onPress={() => router.replace('/(tabs)')}
          >
            <Text className="text-typography-500 font-medium">Continue with Free Version</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-end p-4">
          <Pressable
            onPress={async () => {
              await skipSubscription();
              router.replace('/(tabs)');
            }}
            className="w-10 h-10 rounded-full bg-background-50 justify-center items-center active:opacity-70"
          >
            <Ionicons name="close" size={24} color="#92400e" />
          </Pressable>
        </View>

        <View className="items-center px-6 mb-8">
          <View className="w-full h-48 bg-background-50 rounded-2xl mb-6 items-center justify-center overflow-hidden">
            <Image
              source={require('@/assets/images/Subscription_meditation.webp')}
              style={{ width: '80%', height: '80%' }}
              contentFit="contain"
            />
          </View>
          <Text className="text-typography-900 text-center font-bold text-2xl font-serif mb-2">
            Support Our Mission
          </Text>
          <Text className="text-typography-900 text-center font-medium text-lg mb-1">
            আমাদের মিশনকে সমর্থন করুন
          </Text>
          <Text className="text-typography-500 text-center text-sm leading-6 max-w-[280px]">
            Help us spread the wisdom of the Bhagavad Gita freely to the world.
          </Text>
        </View>

        <View className="px-6 gap-4 mb-8">
          <Text className="text-typography-400 font-bold text-xs tracking-widest uppercase mb-1">Select a Plan</Text>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isAnnual = plan.packageType === 'ANNUAL';

            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                disabled={purchasing}
                className={`
                    border rounded-2xl p-5 relative overflow-hidden active:scale-[0.99] transition-transform
                    ${isSelected ? 'bg-background-50 border-primary-600 border-2' : 'bg-white border-outline-100'}
                    ${purchasing ? 'opacity-50' : ''}
                `}
              >
                {plan.savings && (
                  <View className="absolute top-0 right-0 bg-primary-600 px-3 py-1 rounded-bl-xl">
                    <Text className="text-white text-[10px] font-bold tracking-wider uppercase">Best Value</Text>
                  </View>
                )}

                <View className="flex-row items-center gap-4">
                  <View
                    className={`
                        w-6 h-6 rounded-full border items-center justify-center
                        ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-outline-300'}
                    `}
                  >
                    {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>

                  <View className="flex-1">
                    <Text className="text-typography-900 font-bold text-lg mb-0.5">
                      {plan.name}
                    </Text>
                    <Text className="text-typography-500 text-sm">
                      {plan.packageType === 'ANNUAL' && plan.pricePerYear > 0
                        ? `$${plan.pricePerYear.toFixed(2)} / year`
                        : plan.price + (plan.packageType === 'MONTHLY' ? ' / month' : '')}
                    </Text>
                    {isAnnual && plan.pricePerMonth > 0 && (
                      <Text className="text-typography-400 text-xs mt-1 font-medium">
                        Just ${plan.pricePerMonth.toFixed(2)}/mo
                      </Text>
                    )}
                  </View>

                  <View className="items-end">
                    <Text className="text-typography-900 font-bold text-lg">{plan.price}</Text>
                    {plan.savings && (
                      <Text className="text-green-600 text-xs font-bold mt-0.5">{plan.savings}</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="px-6 mb-6">
          <Pressable
            className={`rounded-xl bg-primary-600 items-center justify-center h-14 ${purchasing ? 'opacity-80' : ''}`}
            onPress={handlePurchase}
            disabled={purchasing || !selectedPlan}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View className="items-center">
                <Text className="text-white font-bold text-base">Start Membership</Text>
                <Text className="text-typography-300 text-[10px] font-medium mt-0.5 tracking-wider uppercase">সদস্যপদ শুরু করুন</Text>
              </View>
            )}
          </Pressable>
          <Text className="text-typography-400 text-center text-[10px] mt-3 px-4">
            Recurring billing, cancel anytime. By continuing you agree to our Terms.
          </Text>
        </View>

        <View className="flex-row justify-center gap-6 mt-2">
          <Pressable hitSlop={10}>
            <Text className="text-typography-500 text-xs font-medium">Restore Purchases</Text>
          </Pressable>
          <Pressable hitSlop={10}>
            <Text className="text-typography-500 text-xs font-medium">Terms</Text>
          </Pressable>
          <Pressable hitSlop={10}>
            <Text className="text-typography-500 text-xs font-medium">Privacy</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
