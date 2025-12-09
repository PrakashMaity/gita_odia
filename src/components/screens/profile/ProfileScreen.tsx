import { PasswordModal } from '@/components/screens/developer/components/PasswordModal/PasswordModal';
import { SettingsItem, SettingsSection } from '@/components/settings';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useProStatus } from '@/hooks/useProStatus';
import { showRatingPrompt } from '@/hooks/useRatingPrompter';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { shareApp } from '@/services/appShareService';
import { LayoutImages } from '@/utils/assets';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { PointsDisplay } from './components/PointsDisplay/PointsDisplay';
import { ProfileHeader } from './components/ProfileHeader';
import { ShareStats } from './components/ShareStats/ShareStats';
import { SubscriptionDetails } from './components/SubscriptionDetails';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const theme = useThemeColors();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { isPro, refreshStatus } = useProStatus();
  const [showDeveloperButton, setShowDeveloperButton] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Refresh PRO status when component mounts
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
    // Show developer button after 10 taps on Settings title
    setShowDeveloperButton(true);
  };

  const handleDeveloperButtonClick = () => {
    // When developer button is clicked, show password modal
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
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant='transparent' style={styles.container}>
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
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SettingsSection 
            title="Points" 
            description={i18n.t('profile.pointsDesc')}
          >
            <PointsDisplay />
          </SettingsSection>

          <SettingsSection 
            title="Subscription" 
            description="Upgrade to Pro and unlock all premium features"
          >
            {isPro ? (
              <SubscriptionDetails />
            ) : (
              <SettingsItem
                title="Upgrade to Pro"
                subtitle="Unlock all premium features"
                icon={<MaterialIcons name="workspace-premium" size={SIZES.icon.md} color={theme.icon.primary} />}
                onPress={() => router.push('/subscription')}
              />
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
              icon={<MaterialIcons name="share" size={SIZES.icon.md} color={theme.icon.primary} />}
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
              icon={<Feather name="info" size={SIZES.icon.md} color={theme.icon.primary} />}
              value={constants.expoConfig?.version}
            />
            <SettingsItem
              title={i18n.t('profile.rateApp')}
              subtitle={i18n.t('profile.rateAppDesc')}
              icon={<MaterialIcons name="star" size={SIZES.icon.md} color={theme.icon.primary} />}
              onPress={handleRateApp}
            />
          </SettingsSection>

          <ThemedView style={styles.bottomSpacing} />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
