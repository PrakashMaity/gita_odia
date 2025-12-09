import { SettingsItem } from '@/components/settings';
import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { getProStatus } from '@/services/proService';
import { revenueCatService } from '@/services/revenueCat/revenueCatService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform } from 'react-native';
import type { PurchasesEntitlementInfo } from 'react-native-purchases';
import { styles } from './SubscriptionDetails.styles';

export const SubscriptionDetails: React.FC = () => {
  const theme = useThemeColors();
  const { customerInfo, isLoading, refreshCustomerInfo } = useRevenueCat();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [activeEntitlement, setActiveEntitlement] = useState<PurchasesEntitlementInfo | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [freeProStatus, setFreeProStatus] = useState<{ isActive: boolean; proUntil: number; remainingDays: number; remainingHours: number } | null>(null);

  useEffect(() => {
    if (customerInfo) {
      const entitlements = customerInfo.entitlements.active;
      // Get the first active entitlement (usually 'premium')
      const entitlementKey = Object.keys(entitlements)[0];
      if (entitlementKey) {
        setActiveEntitlement(entitlements[entitlementKey]);
      } else {
        setActiveEntitlement(null);
      }
    } else {
      setActiveEntitlement(null);
    }
  }, [customerInfo]);

  useEffect(() => {
    refreshCustomerInfo();
    // Also check free Pro status
    const checkFreePro = async () => {
      const status = await getProStatus();
      setFreeProStatus({
        isActive: status.isActive,
        proUntil: status.proUntil,
        remainingDays: status.remainingDays,
        remainingHours: status.remainingHours,
      });
    };
    checkFreePro();
    
    // Refresh free Pro status every minute to update expiration time
    const interval = setInterval(checkFreePro, 60000);
    
    return () => clearInterval(interval);
  }, [refreshCustomerInfo]);

  if (isLoading) {
    return (
      <ThemedView variant="secondary" style={styles.loadingContainer}>
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

  // If no RevenueCat entitlement, check for free Pro
  if (!activeEntitlement && (!freeProStatus || !freeProStatus.isActive)) {
    return null;
  }

  const expirationDate = activeEntitlement?.expirationDate
    ? new Date(activeEntitlement.expirationDate)
    : null;

  // Free Pro expiration (if no RevenueCat subscription)
  const freeProExpirationDate = freeProStatus?.isActive && !activeEntitlement
    ? new Date(freeProStatus.proUntil)
    : null;

  const isActive = activeEntitlement?.isActive ?? false;
  const productIdentifier = activeEntitlement?.productIdentifier ?? 'Free Pro';
  const periodType = activeEntitlement?.periodType;
  
  // Format product identifier for display
  const getPlanName = (identifier: string): string => {
    if (identifier === 'Free Pro') {
      return 'Free Pro';
    }
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

  const formatDateTime = (date: Date): string => {
    const dateStr = date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${dateStr} ${timeStr}`;
  };

  const getStatusText = (): string => {
    const expDate = expirationDate || freeProExpirationDate;
    if (!isActive && !freeProStatus?.isActive) {
      return i18n.t('subscription.expired');
    }
    if (periodType === 'NORMAL' || freeProExpirationDate) {
      return expDate
        ? `${i18n.t('subscription.expiresOn')} ${formatDateTime(expDate)}`
        : i18n.t('subscription.active');
    }
    if (periodType === 'TRIAL') {
      return i18n.t('subscription.trial');
    }
    return i18n.t('subscription.active');
  };

  const getDaysRemaining = (): number | null => {
    const expDate = expirationDate || freeProExpirationDate;
    if (!expDate) return null;
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const getHoursRemaining = (): number | null => {
    const expDate = expirationDate || freeProExpirationDate;
    if (!expDate) return null;
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours > 0 ? diffHours : null;
  };

  const daysRemaining = getDaysRemaining();
  const hoursRemaining = getHoursRemaining();

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

  // Only show cancel button if subscription will renew (not lifetime) and has RevenueCat subscription
  const canCancel = activeEntitlement && activeEntitlement.willRenew !== false && expirationDate !== null;

  const expDate = expirationDate || freeProExpirationDate;
  const isFreePro = !activeEntitlement && freeProStatus?.isActive;

  return (
    <ThemedView style={styles.container}>
      {AlertComponent}
      <SettingsItem
        title={i18n.t('subscription.plan')}
        subtitle={getPlanName(productIdentifier)}
        icon={<MaterialIcons name="workspace-premium" size={SIZES.icon.lg} color={theme.icon.primary} />}
        value={isActive || isFreePro ? i18n.t('subscription.active') : i18n.t('subscription.inactive')}
      />

      {expDate && (
        <SettingsItem
          title={i18n.t('subscription.status')}
          subtitle={getStatusText()}
          icon={<MaterialIcons name="schedule" size={SIZES.icon.lg} color={theme.icon.primary} />}
          value={
            daysRemaining !== null 
              ? `${daysRemaining} ${i18n.t('profile.days')}${hoursRemaining !== null && hoursRemaining < 24 ? `, ${hoursRemaining} ${i18n.t('profile.hours')}` : ''}`
              : undefined
          }
        />
      )}

      {!expDate && activeEntitlement && (
        <SettingsItem
          title={i18n.t('subscription.status')}
          subtitle={i18n.t('subscription.lifetimeAccess')}
          icon={<MaterialIcons name="all-inclusive" size={SIZES.icon.lg} color={theme.icon.primary} />}
          value={i18n.t('subscription.active')}
        />
      )}

      {activeEntitlement && activeEntitlement.willRenew !== undefined && (
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
    </ThemedView>
  );
};

