import { SettingsItem, SettingsSection, SettingsToggle } from '@/components/settings';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { TYPOGRAPHY } from '@/constants/typography';
import { useTheme, useThemeColors } from '@/hooks/useTheme';
import { WavePattern } from '@/illustration/cardBackground';
import { useSettingsStore } from '@/store';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const theme = useThemeColors();
  const { isDark } = useTheme();
  const { 
    settings, 
    updateSetting 
  } = useSettingsStore();
  const { width, height } = Dimensions.get('window');

  const handleThemeChange = () => {
    const newMode = isDark ? 'light' : 'dark';
    updateSetting('themeMode', newMode);
  };



  const handleFontSizeChange = () => {
    const sizes = ['small', 'medium', 'large'] as const;
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    updateSetting('fontSize', sizes[nextIndex]);
  };


  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Small';
      case 'medium': return 'Medium';
      case 'large': return 'Large';
      default: return 'Medium';
    }
  };

  const handleResetOnboarding = () => {
    updateSetting('onboardingCompleted', false);
    router.replace('onboarding' as any);
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
            ସେଟିଂସ
          </ThemedLanguageText>
          <ThemedLanguageText fontFamily='regional_secondary' style={styles.subtitle}>
            ଆପଣଙ୍କର ଗୀତା ଅଭିଜ୍ଞତା କଷ୍ଟମାଇଜ କରନ୍ତୁ
          </ThemedLanguageText>
        </ThemedView>
     
      </ThemedCard>


      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
     

        <SettingsSection 
            title="ଦେଖିବାର ଧରଣ" 
            description="ଅପ୍ର ଚେହେରା ଏବଂ ଅନୁଭୂତି କଷ୍ଟମାଇଜ କରନ୍ତୁ"
          >
            <SettingsToggle
              title="ଡାର୍କ ମୋଡ଼"
              subtitle="ଲାଇଟ୍ ଏବଂ ଡାର୍କ ଥିମର ମଧ୍ୟରେ ପରିବର୍ତ୍ତନ କରନ୍ତୁ"
              icon={<Feather name="moon" size={SIZES.icon.lg} color={theme.icon.primary} />}
              value={isDark}
              onValueChange={handleThemeChange}
              showDivider={true}
            />
          
          </SettingsSection>


          <SettingsSection 
            title="ସମ୍ପର୍କରେ" 
            description="ଅପ୍ର ତଥ୍ୟ ଏବଂ ସହାୟତା"
          >
            <SettingsItem
              title="ଅପ୍ର ଭର୍ସନ"
              subtitle="ଭଗବଦ୍ ଗୀତା ଅପ୍ର ବର୍ତ୍ତମାନ ଭର୍ସନ"
              icon={<Feather name="info" size={SIZES.icon.lg} color={theme.icon.primary} />}
              value="1.0.0"
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
