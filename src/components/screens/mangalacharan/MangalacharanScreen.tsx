import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Dimensions, ScrollView } from 'react-native';
import { PageHeader } from '../shared/PageHeader';
import { styles } from './MangalacharanScreen.styles';

export const MangalacharanScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const mangalacharanText = i18n.t('mangalacharan.mantraText');
  const meaningText = i18n.t('mangalacharan.meaningText');

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern width={width} height={height} />
      
      <PageHeader title={i18n.t('mangalacharan.title')} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            {(i18n.t('mangalacharan.instructions') as string[]).map((instruction: string, index: number) => (
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
};
