import { PageHeader } from '@/components/shared';
import { LoadingState } from '@/components/shared';
import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { createErrorAlert, createInfoAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { PurchaseCancelledError, PurchaseTestFailureError } from '@/services/revenueCat/errors';
import { syncSubscriptionToFirebase, trackPurchaseSuccess, syncPendingSubscriptionData } from '@/services/revenueCat/firebaseSync';
import { revenueCatService } from '@/services/revenueCat/revenueCatService';
import i18n from '@/i18n';
import { LayoutImages } from '@/utils/assets';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, View } from 'react-native';
import { SubscriptionPlanCard } from './components/SubscriptionPlanCard';
import { ProBenefitsSection } from './components/ProBenefitsSection';
import { styles } from './SubscriptionScreen.styles';
import { formatPackagePrice } from '@/utils/priceFormatter';
import { SIZES } from '@/rootconstants/sizes';
import type { PurchasesPackage } from 'react-native-purchases';

export const SubscriptionScreen: React.FC = () => {
  const {
    packages,
    isPremium,
    isLoading: isLoadingPackages,
    isPurchasing,
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
  } = useRevenueCat();
  
  const { showAlert, AlertComponent } = useCustomAlert();
  const [isRestoring, setIsRestoring] = useState(false);

  // Map packages to plans based on identifiers
  // Update these identifiers to match your RevenueCat dashboard
  const monthlyPackage = packages?.find(pkg => 
    pkg.identifier.includes('monthly') || pkg.identifier.includes('month')
  );
  
  const quarterlyPackage = packages?.find(pkg => 
    pkg.identifier.includes('quarterly') || pkg.identifier.includes('quarter') || 
    pkg.identifier.includes('3month') || pkg.identifier.includes('trimonth')
  );
  
  const yearlyPackage = packages?.find(pkg => 
    pkg.identifier.includes('yearly') || pkg.identifier.includes('year') ||
    pkg.identifier.includes('annual') || pkg.identifier.includes('lifetime')
  );

  const handlePurchase = async (packageToPurchase: PurchasesPackage) => {
    try {
      await purchasePackage(packageToPurchase);
      
      // Refresh customer info to update premium status
      await refreshCustomerInfo();
      
      // Sync subscription to Firebase
      try {
        const customerInfo = await revenueCatService.getCustomerInfo();
        await syncSubscriptionToFirebase(customerInfo);
        await trackPurchaseSuccess(packageToPurchase.identifier, customerInfo);
      } catch (syncError) {
        console.error('[SubscriptionScreen] Error syncing to Firebase:', syncError);
        // Don't block purchase success - Firebase sync is optional
      }
      
      showAlert(createSuccessAlert(
        i18n.t('subscription.purchaseSuccess'),
        i18n.t('subscription.purchaseSuccessMessage')
      ));
    } catch (error: any) {
      // Handle cancellation gracefully - it's not an error
      if (error instanceof PurchaseCancelledError) {
        // Don't show an alert for cancellations - user intentionally cancelled
        return;
      }
      
      // Handle test store failures gracefully - show info message
      if (error instanceof PurchaseTestFailureError) {
        showAlert(createInfoAlert(
          i18n.t('subscription.testFailure') || 'Test Mode',
          i18n.t('subscription.testFailureMessage') || 'This is a simulated purchase failure from the test store. In production, this would be a real purchase.',
        ));
        return;
      }
      
      // Handle actual errors
      console.error('[SubscriptionScreen] Purchase error:', error);
      showAlert(createErrorAlert(
        i18n.t('subscription.purchaseError'),
        i18n.t('subscription.purchaseErrorMessage')
      ));
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const customerInfo = await restorePurchases();
      
      // Sync restored subscription to Firebase
      try {
        await syncSubscriptionToFirebase(customerInfo);
        await trackPurchaseSuccess('restored', customerInfo);
      } catch (syncError) {
        console.error('[SubscriptionScreen] Error syncing restored subscription to Firebase:', syncError);
        // Don't block restore success - Firebase sync is optional
      }
      
      showAlert(createSuccessAlert(
        i18n.t('subscription.restoreSuccess'),
        i18n.t('subscription.restoreSuccessMessage')
      ));
    } catch (error) {
      console.error('Restore error:', error);
      showAlert(createErrorAlert(
        i18n.t('subscription.restoreError'),
        i18n.t('subscription.restoreErrorMessage')
      ));
    } finally {
      setIsRestoring(false);
    }
  };

  if (isLoadingPackages) {
    return (
      <ImageBackground
        source={LayoutImages.background1}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={1.5}
      >
        <ThemedView variant="transparent" style={styles.container}>
          <PageHeader title={i18n.t('subscription.title')} />
          <LoadingState message={i18n.t('subscription.loading')} />
        </ThemedView>
      </ImageBackground>
    );
  }

  // Show premium status if already pro
  if (isPremium) {
    return (
      <ImageBackground
        source={LayoutImages.background1}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={1.5}
      >
        <ThemedView variant="transparent" style={styles.container}>
          <PageHeader title={i18n.t('subscription.title')} />
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <ThemedView variant="card" style={styles.premiumCard}>
              <MaterialIcons 
                name="workspace-premium" 
                size={64} 
                color="#FFD700" 
              />
              <ThemedLanguageText
                variant="primary"
                size="title"
                fontFamily="regional_secondary"
                style={styles.premiumTitle}
              >
                {i18n.t('subscription.alreadyPro')}
              </ThemedLanguageText>
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.premiumSubtitle}
              >
                {i18n.t('subscription.purchaseSuccessMessage')}
              </ThemedLanguageText>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        {AlertComponent}
        <PageHeader title={i18n.t('subscription.title')} />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Intro Section */}
          <ThemedCard variant="card" style={styles.introCard} pattern="mandala" patternOpacity={0.05}>
            <View style={styles.introContent}>
              <MaterialIcons 
                name="workspace-premium" 
                size={48} 
                color="#FFD700"
                style={styles.introIcon}
              />
              <ThemedLanguageText
                variant="primary"
                size="xl"
                fontFamily="regional_secondary"
                style={styles.introTitle}
              >
                {i18n.t('subscription.subtitle')}
              </ThemedLanguageText>
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.introDescription}
              >
                {i18n.t('subscription.subtitle')}
              </ThemedLanguageText>
            </View>
          </ThemedCard>

          {/* Pro Benefits Section */}
          <ProBenefitsSection />

          {/* Plans Section */}
          <ThemedView style={styles.plansSection}>
            <ThemedLanguageText
              variant="primary"
              size="lg"
              fontFamily="regional_secondary"
              style={styles.plansSectionTitle}
            >
              {i18n.t('subscription.choosePlan')}
            </ThemedLanguageText>

            <View style={styles.plansContainer}>
              {/* Monthly Plan */}
              {monthlyPackage && (
                <SubscriptionPlanCard
                  title={i18n.t('subscription.monthly')}
                  price={formatPackagePrice(monthlyPackage)}
                  period={i18n.t('subscription.perMonth')}
                  packageToPurchase={monthlyPackage}
                  onPurchase={handlePurchase}
                  isPurchasing={isPurchasing}
                  features={[
                    i18n.t('subscription.features.adFree'),
                    i18n.t('subscription.features.allFeatures'),
                  ]}
                />
              )}

              {/* Quarterly Plan */}
              {quarterlyPackage && (
                <SubscriptionPlanCard
                  title={i18n.t('subscription.quarterly')}
                  price={formatPackagePrice(quarterlyPackage)}
                  period={i18n.t('subscription.perQuarter')}
                  packageToPurchase={quarterlyPackage}
                  onPurchase={handlePurchase}
                  isPurchasing={isPurchasing}
                  showBestValue={false}
                  features={[
                    i18n.t('subscription.features.adFree'),
                    i18n.t('subscription.features.allFeatures'),
                    i18n.t('subscription.features.prioritySupport'),
                  ]}
                />
              )}

              {/* Yearly Plan */}
              {yearlyPackage && (
                <SubscriptionPlanCard
                  title={i18n.t('subscription.yearly')}
                  price={formatPackagePrice(yearlyPackage)}
                  period={i18n.t('subscription.perYear')}
                  packageToPurchase={yearlyPackage}
                  onPurchase={handlePurchase}
                  isPurchasing={isPurchasing}
                  showBestValue={true}
                  features={[
                    i18n.t('subscription.features.adFree'),
                    i18n.t('subscription.features.allFeatures'),
                    i18n.t('subscription.features.prioritySupport'),
                    i18n.t('subscription.features.unlimitedAccess'),
                  ]}
                />
              )}

              {/* Show message if no packages available */}
              {!monthlyPackage && !quarterlyPackage && !yearlyPackage && packages && packages.length > 0 && (
                <ThemedView variant="card" style={styles.noPlansCard}>
                  <ThemedLanguageText
                    variant="secondary"
                    size="medium"
                    fontFamily="regional_secondary"
                  >
                    Available packages: {packages.map(p => p.identifier).join(', ')}
                  </ThemedLanguageText>
                </ThemedView>
              )}
            </View>
          </ThemedView>

          {/* Restore Purchases Button */}
          <ThemedButton
            title={isRestoring ? i18n.t('subscription.restoring') : i18n.t('subscription.restorePurchases')}
            onPress={handleRestorePurchases}
            variant="outline"
            disabled={isRestoring || isPurchasing}
            icon={isRestoring ? <ActivityIndicator size="small" color="#666" /> : undefined}
            style={styles.restoreButton}
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

