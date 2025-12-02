import { SettingsItem, SettingsSection } from '@/components/settings';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer/ResponsiveContainer';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';
import i18n from '@/i18n';
import { LayoutImages } from '@/utils/assets';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import constants from 'expo-constants';
import { ImageBackground, ScrollView } from 'react-native';
import { ProfileHeader } from './components/ProfileHeader';
import { ShareStats } from './components/ShareStats/ShareStats';
import { PointsDisplay } from './components/PointsDisplay/PointsDisplay';
import { shareApp } from '@/services/appShareService';
import { styles } from './ProfileScreen.styles';
import { createSuccessAlert, createErrorAlert, useCustomAlert } from '@/hooks/useCustomAlert';

export const ProfileScreen: React.FC = () => {
  const theme = useThemeColors();
  const layout = useDeviceLayout();
  const { showAlert, AlertComponent } = useCustomAlert();

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

  return (
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant='transparent' style={styles.container}>
        {AlertComponent}
        <ResponsiveContainer horizontalPadding={layout.isTablet ? layout.horizontalPadding : SIZES.spacing.lg}>
          <ProfileHeader />
        </ResponsiveContainer>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: layout.sectionSpacing },
          ]}
        >
          <ResponsiveContainer contentStyle={styles.sectionStack}>
            <SettingsSection 
              title={i18n.t('profile.pointsEarned')} 
              description={i18n.t('profile.pointsDesc')}
            >
              <PointsDisplay />
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
            </SettingsSection>

            <ThemedView style={styles.bottomSpacing} />
          </ResponsiveContainer>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
