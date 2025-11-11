import { SettingsItem, SettingsSection } from '@/components/settings';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { LayoutImages } from '@/utils/assets';
import Feather from '@expo/vector-icons/Feather';
import constants from 'expo-constants';
import { ImageBackground, ScrollView } from 'react-native';
import { ProfileHeader } from './components/ProfileHeader';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const theme = useThemeColors();

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
