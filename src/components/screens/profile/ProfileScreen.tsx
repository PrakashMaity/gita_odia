import { SettingsItem, SettingsSection } from '@/components/settings';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { LayoutImages } from '@/utils/assets';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import constants from 'expo-constants';
import { ImageBackground, ScrollView, Alert } from 'react-native';
import { ProfileHeader } from './components/ProfileHeader';
import { ShareStats } from './components/ShareStats/ShareStats';
import { PointsDisplay } from './components/PointsDisplay/PointsDisplay';
import { shareApp } from '@/services/appShareService';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const theme = useThemeColors();

  const handleShareApp = async () => {
    try {
      const success = await shareApp();
      if (success) {
        Alert.alert(
          i18n.t('share.success'),
          i18n.t('share.textShared'),
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          i18n.t('share.error'),
          i18n.t('share.shareFailed'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert(
        i18n.t('share.error'),
        i18n.t('share.shareFailed'),
        [{ text: 'OK' }]
      );
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
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
