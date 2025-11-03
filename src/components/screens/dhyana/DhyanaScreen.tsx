import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Dimensions, ScrollView } from 'react-native';
import { PageHeader } from '../shared/PageHeader';
import { styles } from './DhyanaScreen.styles';

export const DhyanaScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const dhyanaText = i18n.t('dhyana.slokaText');
  const meaningText = i18n.t('dhyana.meaningText');
  const benefits = i18n.t('dhyana.benefits') as string[];
  const steps = i18n.t('dhyana.steps') as string[];

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern width={width} height={height} />
      
      <PageHeader title={i18n.t('dhyana.title')} showBackButton={true} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedCard style={styles.introCard}>
          <ThemedLanguageText 
            variant="primary" 
            size="large" 
            fontFamily="regional_secondary"
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

        <ThemedCard style={styles.dhyanaCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('dhyana.slokaTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedLanguageText 
            variant="primary"
            size="large"
            fontFamily="regional_secondary"
            style={styles.dhyanaText}
          >
            {dhyanaText}
          </ThemedLanguageText>
        </ThemedCard>

        <ThemedCard style={styles.meaningCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_secondary"
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

        <ThemedCard style={styles.benefitsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('dhyana.benefitsTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.benefitsList}>
            {benefits.map((benefit: string, index: number) => (
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

        <ThemedCard style={styles.stepsCard}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="primary" 
              size="xl" 
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('dhyana.stepsTitle')}
            </ThemedLanguageText>
          </ThemedView>
          
          <ThemedView style={styles.stepsList}>
            {steps.map((step: string, index: number) => (
              <ThemedView key={index} style={styles.stepItem}>
                <ThemedView style={[styles.stepNumber, { backgroundColor: theme.background.quaternary }]}>
                  <ThemedLanguageText 
                    variant="primary"
                    size="small"
                    fontFamily="regional_secondary"
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
};
