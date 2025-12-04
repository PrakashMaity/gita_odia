import { SettingsItem, SettingsSection } from '@/components/settings';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { LayoutImages } from '@/utils/assets';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import constants from 'expo-constants';
import { ImageBackground, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ProfileHeader } from './components/ProfileHeader';
import { SubscriptionDetails } from './components/SubscriptionDetails';
import { ShareStats } from './components/ShareStats/ShareStats';
import { PointsDisplay } from './components/PointsDisplay/PointsDisplay';
import { useProStatus } from '@/hooks/useProStatus';
import { shareApp } from '@/services/appShareService';
import { styles } from './ProfileScreen.styles';
import { createSuccessAlert, createErrorAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { showRatingPrompt } from '@/hooks/useRatingPrompter';
import { useEffect } from 'react';

export const ProfileScreen: React.FC = () => {
  const theme = useThemeColors();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { isPro, refreshStatus } = useProStatus();

  // Refresh PRO status when component mounts
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleShareApp = async () => {
    try {
      const success = await shareApp();
      if (success) {
        showAlert(createSuccessAlert(
          i18n.t('share.success'),
          i18n.t('share.textShared')
        ));
      } else {
        showAlert(createErrorAlert(
          i18n.t('share.error'),
          i18n.t('share.shareFailed')
        ));
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      showAlert(createErrorAlert(
        i18n.t('share.error'),
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

  return (
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant='transparent' style={styles.container}>
        {AlertComponent}
        <ProfileHeader />

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SettingsSection 
            title={i18n.t('profile.pointsEarned')} 
            description={i18n.t('profile.pointsDesc')}
          >
            <PointsDisplay />
          </SettingsSection>

          <SettingsSection 
            title={i18n.t('profile.subscription')} 
            description={i18n.t('profile.subscriptionDesc')}
          >
            {isPro ? (
              <SubscriptionDetails />
            ) : (
              <SettingsItem
                title={i18n.t('profile.goToPro')}
                subtitle={i18n.t('profile.goToProDesc')}
                icon={<MaterialIcons name="workspace-premium" size={SIZES.icon.lg} color={theme.icon.primary} />}
                onPress={() => router.push('/subscription')}
              />
            )}
          </SettingsSection>

          <SettingsSection 
            title={i18n.t('profile.sharing')} 
            description={i18n.t('profile.sharingDesc')}
          >
            <ShareStats />
            <SettingsItem
              title={i18n.t('profile.shareApp')}
              subtitle={i18n.t('profile.shareAppDesc')}
              icon={<MaterialIcons name="share" size={SIZES.icon.lg} color={theme.icon.primary} />}
              onPress={handleShareApp}
            />
          </SettingsSection>

          <SettingsSection 
            title={i18n.t('profile.about')} 
            description={i18n.t('profile.aboutDesc')}
          >
            <SettingsItem
              title={i18n.t('profile.appVersion')}
              subtitle={i18n.t('profile.appVersionDesc')}
              icon={<Feather name="info" size={SIZES.icon.lg} color={theme.icon.primary} />}
              value={constants.expoConfig?.version}
            />
            <SettingsItem
              title={i18n.t('profile.rateApp')}
              subtitle={i18n.t('profile.rateAppDesc')}
              icon={<MaterialIcons name="star" size={SIZES.icon.lg} color={theme.icon.primary} />}
              onPress={handleRateApp}
            />
          </SettingsSection>

          <ThemedView style={styles.bottomSpacing} />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
