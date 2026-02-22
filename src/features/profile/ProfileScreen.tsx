import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { PasswordModal } from '@/features/developer/components/PasswordModal/PasswordModal';
import { SettingsItem, SettingsSection } from '@/features/profile/components/settings';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useProStatus } from '@/hooks/useProStatus';
import { showRatingPrompt } from '@/hooks/useRatingPrompter';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { shareApp } from '@/services/appShareService';
import { useProStore } from '@/store/proStore';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { PointsDisplay } from './components/PointsDisplay/PointsDisplay';
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader';
import { ShareStats } from './components/ShareStats/ShareStats';

export const ProfileScreen: React.FC = () => {
  const theme = useThemeColors();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { isPro, refreshStatus } = useProStatus();
  const subscriptionDetails = useProStore((state) => state.subscriptionDetails);
  const [showDeveloperButton, setShowDeveloperButton] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  /* ... methods ... */
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleShareApp = async () => {
    try {
      const success = await shareApp();
      if (success) {
        showAlert(createSuccessAlert(
          i18n.t('common.success'),
          i18n.t('share.textShared')
        ));
      } else {
        showAlert(createErrorAlert(
          i18n.t('common.error'),
          i18n.t('share.shareFailed')
        ));
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      showAlert(createErrorAlert(
        i18n.t('common.error'),
        i18n.t('share.shareFailed')
      ));
    }
  };

  const handleRateApp = async () => {
    try {
      await showRatingPrompt();
    } catch (error) {
      console.error('Error showing rating prompt:', error);
      showAlert(createErrorAlert(
        i18n.t('common.error'),
        i18n.t('share.shareFailed')
      ));
    }
  };

  const handleTitleTaps = () => {
    setShowDeveloperButton(true);
  };

  const handleDeveloperButtonClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setShowDeveloperButton(false);
    router.push('/developer-panel');
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
  };

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      {AlertComponent}
      <ProfileHeader
        onDeveloperButtonPress={handleTitleTaps}
        showDeveloperButton={showDeveloperButton}
        onDeveloperButtonClick={handleDeveloperButtonClick}
      />

      <PasswordModal
        visible={showPasswordModal}
        onSuccess={handlePasswordSuccess}
        onCancel={handlePasswordCancel}
      />

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        <SettingsSection
          title="Points"
          description={i18n.t('profile.pointsDesc')}
        >
          <PointsDisplay />
        </SettingsSection>

        <SettingsSection
          title="Subscription"
          description={isPro ? "You are a Pro member. Thank you for your support!" : "Upgrade to Pro and unlock all premium features"}
        >
          {isPro && (
            <Box className="bg-background-50 rounded-2xl p-5 mb-4 border border-outline-100">
              <HStack className="justify-between items-center mb-2">
                <Text className="text-typography-900 font-bold text-lg">
                  {subscriptionDetails?.planName || 'Pro Member'}
                </Text>
                <Box className="bg-primary-600 px-3 py-1 rounded-lg">
                  <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Active</Text>
                </Box>
              </HStack>
              {subscriptionDetails?.expirationDate && (
                <Text className="text-typography-500 text-sm">
                  {subscriptionDetails.willRenew ? 'Next renewal' : 'Expires'}: {subscriptionDetails.expirationDate}
                </Text>
              )}
              {!subscriptionDetails && isPro && (
                <Text className="text-typography-500 text-sm">
                  Free Pro access active via points/rewards.
                </Text>
              )}
            </Box>
          )}

          {!isPro && (
            <>
              <SettingsItem
                title="Upgrade to Pro"
                subtitle="Unlock all premium features"
                icon={<MaterialIcons name="workspace-premium" size={24} color={theme.icon.primary} />}
                onPress={() => router.push('/subscription')}
              />
              <SettingsItem
                title="Subscription Details"
                subtitle="Plan, expiry, and points balance"
                icon={<MaterialIcons name="receipt-long" size={24} color={theme.icon.primary} />}
                onPress={() => router.push('/subscription-details')}
              />
            </>
          )}
        </SettingsSection>

        <SettingsSection
          title="Sharing"
          description={i18n.t('profile.sharingDesc')}
        >
          <ShareStats />
          <SettingsItem
            title={i18n.t('profile.shareApp')}
            subtitle={i18n.t('profile.shareAppDesc')}
            icon={<MaterialIcons name="share" size={24} color={theme.icon.primary} />}
            onPress={handleShareApp}
          />
        </SettingsSection>

        <SettingsSection
          title="About"
          description={i18n.t('profile.aboutDesc')}
        >
          <SettingsItem
            title={i18n.t('profile.appVersion')}
            subtitle={i18n.t('profile.appVersionDesc')}
            icon={<Feather name="info" size={24} color={theme.icon.primary} />}
            value={constants.expoConfig?.version}
          />
          <SettingsItem
            title={i18n.t('profile.rateApp')}
            subtitle={i18n.t('profile.rateAppDesc')}
            icon={<MaterialIcons name="star" size={24} color={theme.icon.primary} />}
            onPress={handleRateApp}
          />
        </SettingsSection>

      </ScrollView>
    </Box>
  );
};
