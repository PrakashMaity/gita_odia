import { SettingsItem, SettingsSection } from '@/components/settings';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useProStatus } from '@/hooks/useProStatus';
import { showRatingPrompt } from '@/hooks/useRatingPrompter';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { shareApp } from '@/services/appShareService';
import { LayoutImages } from '@/utils/assets';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect } from 'react';
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

  // Refresh PRO status when component mounts
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleShareApp = async () => {
    try {
      const success = await shareApp();
      if (success) {
        showAlert(createSuccessAlert(
          'Success',
          'App shared successfully'
        ));
      } else {
        showAlert(createErrorAlert(
          'Error',
          'Unable to share the app. Please try again.'
        ));
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      showAlert(createErrorAlert(
        'Error',
        'Unable to share the app. Please try again.'
      ));
    }
  };

  const handleRateApp = async () => {
    try {
      await showRatingPrompt();
    } catch (error) {
      console.error('Error showing rating prompt:', error);
      showAlert(createErrorAlert(
        'Error',
        'Unable to open rating prompt. Please try again.'
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
            title="Points" 
            description="Earn points by sharing and unlock an ad-free experience"
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
            description="View your sharing statistics and activity"
          >
            <ShareStats />
            <SettingsItem
              title="Share App"
              subtitle="Share this app with your friends and family"
              icon={<MaterialIcons name="share" size={SIZES.icon.md} color={theme.icon.primary} />}
              onPress={handleShareApp}
            />
          </SettingsSection>

          <SettingsSection 
            title="About" 
            description="App information and support"
          >
            <SettingsItem
              title="App Version"
              subtitle="Current version of the app"
              icon={<Feather name="info" size={SIZES.icon.md} color={theme.icon.primary} />}
              value={constants.expoConfig?.version}
            />
            <SettingsItem
              title="Rate App"
              subtitle="Share your feedback and rate the app"
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
