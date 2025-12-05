import { LoadingState } from '@/components/shared';
import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { createErrorAlert, createInfoAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useThemeColors } from '@/hooks/useTheme';
import { PurchaseCancelledError, PurchaseTestFailureError } from '@/services/revenueCat/errors';
import { syncSubscriptionToFirebase, trackPurchaseSuccess } from '@/services/revenueCat/firebaseSync';
import { revenueCatService } from '@/services/revenueCat/revenueCatService';
import { HomeImages, LayoutImages } from '@/utils/assets';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Linking, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { styles } from './SubscriptionScreen.styles';

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
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [freeTrialEnabled, setFreeTrialEnabled] = useState(false);
  const theme = useThemeColors();

  // Map packages to plans based on identifiers
  const monthlyPackage = packages?.find(pkg => 
    pkg.identifier.includes('monthly') || pkg.identifier.includes('month')
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
      }
      
      showAlert(createSuccessAlert(
        'Success!',
        'You have successfully upgraded to PRO mode'
      ));
    } catch (error: any) {
      if (error instanceof PurchaseCancelledError) {
        return;
      }
      
      if (error instanceof PurchaseTestFailureError) {
        showAlert(createInfoAlert(
          'Test Mode',
          'This is a simulated purchase failure from the test store. In production, this would be a real purchase.',
        ));
        return;
      }
      
      console.error('[SubscriptionScreen] Purchase error:', error);
      showAlert(createErrorAlert(
        'Purchase Failed',
        'There was a problem completing the purchase'
      ));
    }
  };

  const handleContinue = async () => {
    const packageToPurchase = selectedPlan === 'yearly' ? yearlyPackage : monthlyPackage;
    if (packageToPurchase) {
      await handlePurchase(packageToPurchase);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const customerInfo = await restorePurchases();
      
      try {
        await syncSubscriptionToFirebase(customerInfo);
        await trackPurchaseSuccess('restored', customerInfo);
      } catch (syncError) {
        console.error('[SubscriptionScreen] Error syncing restored subscription to Firebase:', syncError);
      }
      
      showAlert(createSuccessAlert(
        'Success',
        'Your purchases have been successfully restored'
      ));
    } catch (error) {
      console.error('Restore error:', error);
      showAlert(createErrorAlert(
        'Restore Failed',
        'There was a problem restoring purchases'
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
          <LoadingState message="Loading..." />
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
              <Text style={[styles.premiumTitle, { color: theme.text.primary }]}>
                You're already PRO!
              </Text>
              <Text style={[styles.premiumSubtitle, { color: theme.text.secondary }]}>
                You have successfully upgraded to PRO mode
              </Text>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </ImageBackground>
    );
  }

  // Calculate monthly price for yearly plan
  const getYearlyMonthlyPrice = (): string => {
    if (!yearlyPackage) return '5.83';
    const priceString = yearlyPackage.product.priceString || '';
    const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    if (isNaN(price)) return '5.83';
    return (price / 12).toFixed(2);
  };

  const getYearlyTotalPrice = (): string => {
    if (!yearlyPackage) return '$69.99';
    const priceString = yearlyPackage.product.priceString || '';
    // If already has $, return as is, otherwise add $
    if (priceString.includes('$')) return priceString;
    const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    if (isNaN(price)) return '$69.99';
    return `$${price.toFixed(2)}`;
  };

  const getMonthlyPrice = (): string => {
    if (!monthlyPackage) return '$9.99/mo';
    const priceString = monthlyPackage.product.priceString || '';
    if (priceString.includes('$')) return `${priceString}/mo`;
    const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    if (isNaN(price)) return '$9.99/mo';
    return `$${price.toFixed(2)}/mo`;
  };

  return (
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        {AlertComponent}
        
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Floral Header Section */}
          <View style={styles.floralHeader}>
            <ImageBackground
              source={HomeImages.hero}
              style={styles.floralBackground}
              resizeMode="cover"
            >
              <View style={styles.floralOverlay} />
            </ImageBackground>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.mainTitle, { color: theme.text.primary }]}>
              Start your gardening journey today
            </Text>

            {/* Star Rating */}
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                  key={star}
                  name="star"
                  size={20}
                  color="#FFD700"
                />
              ))}
            </View>

            {/* Testimonial */}
            <View style={styles.testimonialContainer}>
              <Text style={[styles.testimonialText, { color: theme.text.primary }]}>
                "This app turned my brown thumb green almost overnight. My once-droopy pothos now unfurls a new leaf every week!"
              </Text>
              <View style={styles.testimonialAuthor}>
                <Text style={[styles.authorName, { color: theme.text.secondary }]}>
                  CatMomSarah
                </Text>
                <Text style={styles.leafEmoji}>🌿</Text>
              </View>
              
              {/* Pagination Dots */}
              <View style={styles.paginationDots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>

            {/* Free Trial Toggle */}
            <View style={styles.freeTrialContainer}>
              <Text style={[styles.freeTrialText, { color: theme.text.primary }]}>
                Not sure yet? Enable free trial
              </Text>
              <Switch
                value={freeTrialEnabled}
                onValueChange={setFreeTrialEnabled}
                trackColor={{
                  false: '#E0E0E0',
                  true: '#B2DFDB',
                }}
                thumbColor={freeTrialEnabled ? '#4CAF50' : '#F5F5F5'}
                ios_backgroundColor="#E0E0E0"
              />
            </View>
          </View>

          {/* Subscription Plans */}
          <View style={styles.plansContainer}>
            {/* Yearly Plan */}
            {yearlyPackage && (
              <TouchableOpacity
                onPress={() => setSelectedPlan('yearly')}
                style={[
                  styles.planCard,
                  selectedPlan === 'yearly' && styles.planCardSelected,
                ]}
              >
                <View style={styles.planContent}>
                  <View style={styles.planRadioContainer}>
                    <View style={[
                      styles.planRadio,
                      selectedPlan === 'yearly' && styles.planRadioSelected,
                    ]}>
                      {selectedPlan === 'yearly' && (
                        <MaterialIcons name="check" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                  <View style={styles.planDetails}>
                    <Text style={[styles.planTitle, { color: theme.text.primary }]}>
                      Yearly
                    </Text>
                    <Text style={[styles.planSubtitle, { color: theme.text.secondary }]}>
                      12 mo • {getYearlyTotalPrice()}
                    </Text>
                  </View>
                  <Text style={[styles.planPrice, { color: theme.text.primary }]}>
                    ${getYearlyMonthlyPrice()}/mo
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Monthly Plan */}
            {monthlyPackage && (
              <TouchableOpacity
                onPress={() => setSelectedPlan('monthly')}
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly' && styles.planCardSelected,
                ]}
              >
                <View style={styles.planContent}>
                  <View style={styles.planRadioContainer}>
                    <View style={[
                      styles.planRadio,
                      selectedPlan === 'monthly' && styles.planRadioSelected,
                    ]}>
                      {selectedPlan === 'monthly' && (
                        <MaterialIcons name="check" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                  <View style={styles.planDetails}>
                    <Text style={[styles.planTitle, { color: theme.text.primary }]}>
                      Monthly
                    </Text>
                  </View>
                  <Text style={[styles.planPrice, { color: theme.text.primary }]}>
                    {getMonthlyPrice()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Continue Button */}
          <ThemedButton
            title={isPurchasing ? 'Processing...' : 'Continue'}
            onPress={handleContinue}
            variant="primary"
            disabled={isPurchasing || (!yearlyPackage && !monthlyPackage)}
            icon={isPurchasing ? <ActivityIndicator size="small" color="#fff" /> : undefined}
            style={[styles.continueButton, { backgroundColor: '#BA68C8' }]}
            textStyle={{ color: '#FFFFFF', fontWeight: '600' }}
            fullWidth
          />

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={handleRestorePurchases} disabled={isRestoring}>
              <Text style={[styles.footerLink, { color: theme.text.primary }]}>
                {isRestoring ? 'Restoring...' : 'Restore Purchases'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>•</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://example.com/terms')}>
              <Text style={[styles.footerLink, { color: theme.text.primary }]}>
                Terms
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>•</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}>
              <Text style={[styles.footerLink, { color: theme.text.primary }]}>
                Privacy
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
