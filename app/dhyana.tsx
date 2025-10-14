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

export default function DhyanaScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const dhyanaText = i18n.t('dhyana.slokaText');
  const meaningText = i18n.t('dhyana.meaningText');
  const benefits = i18n.t('dhyana.benefits');
  const steps = i18n.t('dhyana.steps');

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
          fontFamily="regional_primary"
          style={styles.title}
        >
          {i18n.t('dhyana.title')}
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
            variant="primary" 
            size="large" 
            fontFamily="regional_primary"
            style={styles.introTitle}
          >
            {i18n.t('dhyana.introTitle')}
          </ThemedLanguageText>
          <ThemedLanguageText 
            variant="secondary" 
            size="medium" 
            fontFamily="regional_secondary"
            style={styles.introText}
          >
            {i18n.t('dhyana.introText')}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Dhyana Text Card */}
        <ThemedCard style={styles.dhyanaCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              {i18n.t('dhyana.slokaTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedLanguageText 
            variant="primary"
            size="large"
            fontFamily="regional_tertiary"
            style={styles.dhyanaText}
          >
            {dhyanaText}
          </ThemedLanguageText>
        </ThemedCard>

        {/* Meaning Card */}
        <ThemedCard style={styles.meaningCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              {i18n.t('dhyana.meaningTitle')}
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

        {/* Benefits Card */}
        <ThemedCard style={styles.benefitsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              {i18n.t('dhyana.benefitsTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <ThemedView key={index} style={styles.benefitItem}>
                <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
                <ThemedLanguageText 
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.benefitText}
                >
                  {benefit}
                </ThemedLanguageText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedCard>

        {/* Steps Card */}
        <ThemedCard style={styles.stepsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_tertiary"
              style={styles.sectionTitle}
            >
              {i18n.t('dhyana.stepsTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.stepsList}>
            {steps.map((step, index) => (
              <ThemedView key={index} style={styles.stepItem}>
                <ThemedView style={[styles.stepNumber, { backgroundColor: theme.background.quaternary }]}>
                  <ThemedLanguageText 
                    variant="primary"
                    size="small"
                    fontFamily="regional_primary"
                    style={styles.stepNumberText}
                  >
                    {index + 1}
                  </ThemedLanguageText>
                </ThemedView>
                <ThemedLanguageText 
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.stepText}
                >
                  {step}
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
  dhyanaCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  meaningCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  benefitsCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  stepsCard: {
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
  dhyanaText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
    fontStyle: 'italic',
  },
  meaningText: {
    lineHeight: SIZES.spacing.xl,
  },
  benefitsList: {
    gap: SIZES.spacing.md,
  },
  benefitItem: {
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
  benefitText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
  stepsList: {
    gap: SIZES.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacing.xs,
  },
  stepNumberText: {
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
});
