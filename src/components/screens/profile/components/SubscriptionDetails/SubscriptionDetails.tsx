import { SettingsItem } from '@/components/settings';
import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useThemeColors } from '@/hooks/useTheme';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import i18n from '@/i18n';
import { revenueCatService } from '@/services/revenueCat/revenueCatService';
import { SIZES } from '@/rootconstants/sizes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import type { PurchasesEntitlementInfo } from 'react-native-purchases';
import { styles } from './SubscriptionDetails.styles';

export const SubscriptionDetails: React.FC = () => {
  const theme = useThemeColors();
  const { customerInfo, isLoading, refreshCustomerInfo } = useRevenueCat();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [activeEntitlement, setActiveEntitlement] = useState<PurchasesEntitlementInfo | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (customerInfo) {
      const entitlements = customerInfo.entitlements.active;
      // Get the first active entitlement (usually 'premium')
      const entitlementKey = Object.keys(entitlements)[0];
      if (entitlementKey) {
        setActiveEntitlement(entitlements[entitlementKey]);
      }
    }
  }, [customerInfo]);

  useEffect(() => {
    refreshCustomerInfo();
  }, [refreshCustomerInfo]);

  if (isLoading) {
    return (
      <ThemedView variant="card" style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.icon.primary} />
        <ThemedLanguageText
          variant="secondary"
          size="medium"
          fontFamily="regional_secondary"
          style={styles.loadingText}
        >
          {i18n.t('subscription.loading')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  if (!activeEntitlement) {
    return null;
  }

  const expirationDate = activeEntitlement.expirationDate
    ? new Date(activeEntitlement.expirationDate)
    : null;

  const isActive = activeEntitlement.isActive;
  const productIdentifier = activeEntitlement.productIdentifier;
  const periodType = activeEntitlement.periodType;
  
  // Format product identifier for display
  const getPlanName = (identifier: string): string => {
    if (identifier.includes('monthly') || identifier.includes('month')) {
      return i18n.t('subscription.monthly');
    }
    if (identifier.includes('quarterly') || identifier.includes('quarter') || identifier.includes('3month')) {
      return i18n.t('subscription.quarterly');
    }
    if (identifier.includes('yearly') || identifier.includes('year') || identifier.includes('annual')) {
      return i18n.t('subscription.yearly');
    }
    if (identifier.includes('lifetime')) {
      return i18n.t('subscription.lifetime');
    }
    return identifier;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusText = (): string => {
    if (!isActive) {
      return i18n.t('subscription.expired');
    }
    if (periodType === 'NORMAL') {
      return expirationDate
        ? `${i18n.t('subscription.expiresOn')} ${formatDate(expirationDate)}`
        : i18n.t('subscription.active');
    }
    if (periodType === 'TRIAL') {
      return i18n.t('subscription.trial');
    }
    return i18n.t('subscription.active');
  };

  const getDaysRemaining = (): number | null => {
    if (!expirationDate) return null;
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const daysRemaining = getDaysRemaining();

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      // Get the management URL from RevenueCat
      const managementURL = await revenueCatService.getManagementURL();
      
      if (managementURL) {
        // Check if we can open the URL
        const canOpen = await Linking.canOpenURL(managementURL);
        
        if (canOpen) {
          await Linking.openURL(managementURL);
          showAlert(createSuccessAlert(
            i18n.t('subscription.managementOpened'),
            i18n.t('subscription.managementOpenedMessage')
          ));
        } else {
          throw new Error('Cannot open management URL');
        }
      } else {
        // Show manual instructions if URL is not available
        const instructions = Platform.OS === 'ios'
          ? i18n.t('subscription.iosCancelInstructions')
          : i18n.t('subscription.androidCancelInstructions');
        
        showAlert(createErrorAlert(
          i18n.t('subscription.managementUnavailable'),
          instructions
        ));
      }
    } catch (error) {
      console.error('Error opening subscription management:', error);
      const instructions = Platform.OS === 'ios'
        ? i18n.t('subscription.iosCancelInstructions')
        : i18n.t('subscription.androidCancelInstructions');
      
      showAlert(createErrorAlert(
        i18n.t('subscription.cancelError'),
        instructions
      ));
    } finally {
      setIsCancelling(false);
    }
  };

  // Only show cancel button if subscription will renew (not lifetime)
  const canCancel = activeEntitlement.willRenew !== false && expirationDate !== null;

  return (
    <View style={styles.container}>
      {AlertComponent}
      <SettingsItem
        title={i18n.t('subscription.plan')}
        subtitle={getPlanName(productIdentifier)}
        icon={<MaterialIcons name="workspace-premium" size={SIZES.icon.lg} color={theme.icon.primary} />}
        value={isActive ? i18n.t('subscription.active') : i18n.t('subscription.inactive')}
      />

      {expirationDate && (
        <SettingsItem
          title={i18n.t('subscription.status')}
          subtitle={getStatusText()}
          icon={<MaterialIcons name="schedule" size={SIZES.icon.lg} color={theme.icon.primary} />}
          value={daysRemaining !== null ? `${daysRemaining} ${i18n.t('profile.days')}` : undefined}
        />
      )}

      {!expirationDate && (
        <SettingsItem
          title={i18n.t('subscription.status')}
          subtitle={i18n.t('subscription.lifetimeAccess')}
          icon={<MaterialIcons name="all-inclusive" size={SIZES.icon.lg} color={theme.icon.primary} />}
          value={i18n.t('subscription.active')}
        />
      )}

      {activeEntitlement.willRenew !== undefined && (
        <SettingsItem
          title={i18n.t('subscription.renewal')}
          subtitle={
            activeEntitlement.willRenew
              ? i18n.t('subscription.autoRenewOn')
              : i18n.t('subscription.autoRenewOff')
          }
          icon={
            <MaterialIcons
              name={activeEntitlement.willRenew ? 'autorenew' : 'cancel'}
              size={SIZES.icon.lg}
              color={theme.icon.primary}
            />
          }
        />
      )}

      {/* Cancel Subscription Button - Only show for renewable subscriptions */}
      {canCancel && (
        <ThemedButton
          title={isCancelling ? i18n.t('subscription.cancelling') : i18n.t('subscription.cancelSubscription')}
          onPress={handleCancelSubscription}
          variant="outline"
          disabled={isCancelling}
          icon={isCancelling ? <ActivityIndicator size="small" color={theme.text.primary} /> : undefined}
          style={styles.cancelButton}
          fullWidth
        />
      )}
    </View>
  );
};

