import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { SettingsItem } from '@/features/profile/components/settings';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getProStatus } from '@/services/proService';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export const SubscriptionDetails: React.FC = () => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const [isLoading, setIsLoading] = useState(true);
  const [freeProStatus, setFreeProStatus] = useState<{ isActive: boolean; proUntil: number; remainingDays: number; remainingHours: number } | null>(null);

  useEffect(() => {
    // Check free Pro status
    const checkFreePro = async () => {
      setIsLoading(true);
      try {
        const status = await getProStatus();
        setFreeProStatus({
          isActive: status.isActive,
          proUntil: status.proUntil,
          remainingDays: status.remainingDays,
          remainingHours: status.remainingHours,
        });
      } catch (error) {
        console.error('[SubscriptionDetails] Error checking Pro status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkFreePro();

    // Refresh free Pro status every minute to update expiration time
    const interval = setInterval(checkFreePro, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Box className="items-center justify-center p-4">
        <ActivityIndicator size="small" color={theme.status.success} />
        <Text
          className="mt-2 text-[14px] font-medium text-neutral-500"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {i18n.t('subscription.loading')}
        </Text>
      </Box>
    );
  }

  // If no free Pro status, don't show anything
  if (!freeProStatus || !freeProStatus.isActive) {
    return null;
  }

  // Free Pro expiration
  const freeProExpirationDate = freeProStatus.isActive
    ? new Date(freeProStatus.proUntil)
    : null;

  const isActive = freeProStatus.isActive;
  const productIdentifier = 'Free Pro';

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
    const expDate = freeProExpirationDate;
    if (!isActive) {
      return i18n.t('subscription.expired');
    }
    if (freeProExpirationDate) {
      return expDate
        ? `${i18n.t('subscription.expiresOn')} ${formatDateTime(expDate)}`
        : i18n.t('subscription.active');
    }
    return i18n.t('subscription.active');
  };

  const getDaysRemaining = (): number | null => {
    const expDate = freeProExpirationDate;
    if (!expDate) return null;
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const getHoursRemaining = (): number | null => {
    const expDate = freeProExpirationDate;
    if (!expDate) return null;
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours > 0 ? diffHours : null;
  };

  const daysRemaining = getDaysRemaining();
  const hoursRemaining = getHoursRemaining();

  const expDate = freeProExpirationDate;
  const isFreePro = freeProStatus?.isActive;

  return (
    <Box className="w-full">
      <SettingsItem
        title={i18n.t('subscription.plan')}
        subtitle={getPlanName(productIdentifier)}
        icon={<MaterialIcons name="workspace-premium" size={24} color={theme.icon.primary} />}
        value={isActive || isFreePro ? i18n.t('subscription.active') : i18n.t('subscription.inactive')}
      />

      {expDate && (
        <SettingsItem
          title={i18n.t('subscription.status')}
          subtitle={getStatusText()}
          icon={<MaterialIcons name="schedule" size={24} color={theme.icon.primary} />}
          value={
            daysRemaining !== null
              ? `${daysRemaining} ${i18n.t('profile.days')}${hoursRemaining !== null && hoursRemaining < 24 ? `, ${hoursRemaining} ${i18n.t('profile.hours')}` : ''}`
              : undefined
          }
        />
      )}
    </Box>
  );
};
