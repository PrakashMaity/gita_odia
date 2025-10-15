import { SettingsItem, SettingsSection, SettingsToggle } from '@/components/settings';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { TYPOGRAPHY } from '@/constants/typography';
import { useTheme, useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { useSettingsStore } from '@/store';
import Feather from '@expo/vector-icons/Feather';
import constants from 'expo-constants';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const theme = useThemeColors();
  const { isDark } = useTheme();
  const { 
    updateSetting 
  } = useSettingsStore();
  const { width, height } = Dimensions.get('window');

  const handleThemeChange = () => {
    const newMode = isDark ? 'light' : 'dark';
    updateSetting('themeMode', newMode);
  };




  return (
    <ThemedView variant='primary' style={styles.container}>
      <WavePattern 
        width={width} 
        height={height} 
      />
      
      {/* Header Card */}
      <ThemedCard variant='transparent' style={styles.headerCard}>
        <ThemedView style={styles.headerContent}>
          <ThemedLanguageText
            variant="primary" 
            size="xxl" 
            fontFamily="regional_secondary"
            style={styles.title}
          >
            {i18n.t('profile.settings')}
          </ThemedLanguageText>
          <ThemedLanguageText 
            variant="secondary"
            size="medium"
            fontFamily="regional_secondary" 
            style={styles.subtitle}
          >
            {i18n.t('profile.customizeExperience')}
          </ThemedLanguageText>
        </ThemedView>
     
      </ThemedCard>


      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
     

        <SettingsSection 
            title={i18n.t('profile.appearance')} 
            description={i18n.t('profile.appearanceDesc')}
          >
            <SettingsToggle
              title={i18n.t('profile.darkMode')}
              subtitle={i18n.t('profile.darkModeDesc')}
              icon={<Feather name="moon" size={SIZES.icon.lg} color={theme.icon.primary} />}
              value={isDark}
              onValueChange={handleThemeChange}
              showDivider={true}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    // marginBottom: SIZES.spacing.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    borderWidth: 1,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  bottomSpacing: {
    height: SIZES.spacing.huge,
  },
  quickActionsCard: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginTop: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.sm,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.spacing.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: 'center',
  },
});
