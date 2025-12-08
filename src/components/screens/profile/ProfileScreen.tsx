import { SettingsItem, SettingsSection, SettingsToggle } from '@/components/settings';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useAdStatus } from '@/hooks/useAdStatus';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useProStatus } from '@/hooks/useProStatus';
import { showRatingPrompt } from '@/hooks/useRatingPrompter';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { shareApp } from '@/services/appShareService';
import { useSettingsStore } from '@/store/settingsStore';
import { LayoutImages } from '@/utils/assets';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { PointsDisplay } from './components/PointsDisplay/PointsDisplay';
import { ProfileHeader } from './components/ProfileHeader';
import { ShareStats } from './components/ShareStats/ShareStats';
import { SubscriptionDetails } from './components/SubscriptionDetails';
import { styles } from './ProfileScreen.styles';

const adStatusStyles = StyleSheet.create({
  statusContainer: {
    marginTop: SIZES.spacing.sm,
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statusTitle: {
    marginBottom: SIZES.spacing.xs,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.spacing.xs / 2,
  },
});

export const ProfileScreen: React.FC = () => {
  const theme = useThemeColors();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { isPro, refreshStatus } = useProStatus();
  const { settings, toggleDeveloperMode } = useSettingsStore();
  const adStatus = useAdStatus();

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

          {__DEV__ && (
            <SettingsSection 
              title={i18n.t('profile.developer')} 
              description={i18n.t('profile.developerDesc')}
            >
              <SettingsToggle
                title={i18n.t('profile.developerMode')}
                subtitle={i18n.t('profile.developerModeDesc')}
                value={settings.developerMode}
                onValueChange={toggleDeveloperMode}
                icon={<MaterialIcons name="code" size={SIZES.icon.md} color={theme.icon.primary} />}
              />
              
              {/* Ad Status Information */}
              <ThemedView style={adStatusStyles.statusContainer}>
                <ThemedLanguageText 
                  variant="secondary" 
                  size="small" 
                  fontFamily="none"
                  style={[adStatusStyles.statusTitle, { color: theme.text.secondary }]}
                >
                  {i18n.t('profile.adsStatus')}
                </ThemedLanguageText>
                
                <View style={adStatusStyles.statusRow}>
                  <ThemedLanguageText 
                    variant="secondary" 
                    size="small" 
                    fontFamily="none"
                    style={{ color: theme.text.secondary }}
                  >
                    {i18n.t('profile.adsInitialized')}:
                  </ThemedLanguageText>
                  <ThemedLanguageText 
                    variant={adStatus.isInitialized ? 'primary' : 'secondary'} 
                    size="small" 
                    fontFamily="none"
                    style={{ 
                      color: adStatus.isInitialized ? theme.status.success : theme.status.error,
                      fontWeight: '600'
                    }}
                  >
                    {adStatus.isInitialized ? i18n.t('common.yes') : i18n.t('common.no')}
                  </ThemedLanguageText>
                </View>
                
                <View style={adStatusStyles.statusRow}>
                  <ThemedLanguageText 
                    variant="secondary" 
                    size="small" 
                    fontFamily="none"
                    style={{ color: theme.text.secondary }}
                  >
                    {i18n.t('profile.adsEnabled')}:
                  </ThemedLanguageText>
                  <ThemedLanguageText 
                    variant={adStatus.isEnabled ? 'primary' : 'secondary'} 
                    size="small" 
                    fontFamily="none"
                    style={{ 
                      color: adStatus.isEnabled ? theme.status.success : theme.status.error,
                      fontWeight: '600'
                    }}
                  >
                    {adStatus.isEnabled ? i18n.t('common.yes') : i18n.t('common.no')}
                  </ThemedLanguageText>
                </View>
                
                <View style={adStatusStyles.statusRow}>
                  <ThemedLanguageText 
                    variant="secondary" 
                    size="small" 
                    fontFamily="none"
                    style={{ color: theme.text.secondary }}
                  >
                    {i18n.t('profile.adFreeActive')}:
                  </ThemedLanguageText>
                  <ThemedLanguageText 
                    variant={adStatus.adFreeActive ? 'secondary' : 'primary'} 
                    size="small" 
                    fontFamily="none"
                    style={{ 
                      color: adStatus.adFreeActive ? theme.status.warning : theme.text.secondary,
                      fontWeight: '600'
                    }}
                  >
                    {adStatus.adFreeActive ? i18n.t('common.yes') : i18n.t('common.no')}
                  </ThemedLanguageText>
                </View>
              </ThemedView>
            </SettingsSection>
          )}

          <ThemedView style={styles.bottomSpacing} />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
