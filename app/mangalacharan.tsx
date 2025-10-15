import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function MangalacharanScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const mangalacharanText = i18n.t('mangalacharan.mantraText');
  const meaningText = i18n.t('mangalacharan.meaningText');

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern 
        width={width} 
        height={height} 
      />
      
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.lg} color={theme.icon.primary} />
        </TouchableOpacity>
        <ThemedLanguageText 
          variant="primary" 
          size="title" 
          fontFamily="regional_secondary"
          style={styles.title}
        >
          {i18n.t('mangalacharan.title')}
        </ThemedLanguageText>
        <ThemedView style={styles.placeholder} />
      </ThemedView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction Card */}
        <ThemedCard style={styles.introCard}>
         
          <ThemedLanguageText 
            variant="secondary" 
            size="medium" 
            fontFamily="regional_secondary"
            style={styles.introText}
          >
            {i18n.t('mangalacharan.intro')}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Prayer Text Card */}
        <ThemedCard style={styles.prayerCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="large" 
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('mangalacharan.mantraTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedLanguageText 
            variant="primary"
            size="large"
            fontFamily="regional_secondary"
            style={styles.prayerText}
          >
            {mangalacharanText}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Meaning Card */}
        <ThemedCard style={styles.meaningCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="large" 
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('mangalacharan.meaningTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedLanguageText 
            variant="secondary"
            size="medium"
            fontFamily="regional_secondary"
            style={styles.meaningText}
          >
            {meaningText}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Instructions Card */}
        <ThemedCard style={styles.instructionsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="large" 
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('mangalacharan.instructionsTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.instructionList}>
            {i18n.t('mangalacharan.instructions').map((instruction: string, index: number) => (
              <ThemedView key={index} style={styles.instructionItem}>
                <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
                <ThemedLanguageText 
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.instructionText}
                >
                  {instruction}
                </ThemedLanguageText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.sm,
  },
  backButton: {
    padding: SIZES.spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  introCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  introTitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.md,
  },
  introText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
  prayerCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  meaningCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  instructionsCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xxxl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
  },
  prayerText: {
    textAlign: 'center',
 
  },
  meaningText: {
    lineHeight: SIZES.spacing.xl,
  },
  instructionList: {
    gap: SIZES.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: SIZES.radius.round,
    marginTop: SIZES.spacing.sm,
  },
  instructionText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
});
