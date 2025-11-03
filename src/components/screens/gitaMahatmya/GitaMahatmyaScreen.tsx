import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { commonStyles } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Dimensions, ScrollView } from 'react-native';
import { PageHeader } from '../shared/PageHeader';
import { styles } from './GitaMahatmyaScreen.styles';

export const GitaMahatmyaScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const mahatmyaText = i18n.t('gitaMahatmya.mahatmyaText');
  const benefits = i18n.t('gitaMahatmya.benefits') as string[];

  return (
    <ThemedView variant="primary" style={commonStyles.screen.container}>
      <WavePattern width={width} height={height} />
      
      <PageHeader title={i18n.t('gitaMahatmya.title')} />

      <ScrollView 
        style={commonStyles.screen.scrollView} 
        contentContainerStyle={commonStyles.screen.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <ThemedCard style={commonStyles.card.introCard}>
          <ThemedLanguageText variant="secondary" size="medium" fontFamily="regional_secondary" style={commonStyles.text.introText}>
            {i18n.t('gitaMahatmya.intro')}
          </ThemedLanguageText>
        </ThemedCard>

        <ThemedCard style={commonStyles.card.card}>
          <ThemedView style={commonStyles.section.sectionHeader}>
            <ThemedView style={[commonStyles.section.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText variant="primary" size="large" fontFamily="regional_secondary" style={commonStyles.section.sectionTitle}>
              {i18n.t('gitaMahatmya.mahatmyaTitle')}
            </ThemedLanguageText>
          </ThemedView>
          <ThemedLanguageText variant="primary" size="large" fontFamily="regional_secondary" style={styles.mahatmyaText}>
            {mahatmyaText}
          </ThemedLanguageText>
        </ThemedCard>

        <ThemedCard style={commonStyles.card.card}>
          <ThemedView style={commonStyles.section.sectionHeader}>
            <ThemedView style={[commonStyles.section.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText variant="primary" size="large" fontFamily="regional_secondary" style={commonStyles.section.sectionTitle}>
              {i18n.t('gitaMahatmya.benefitsTitle')}
            </ThemedLanguageText>
          </ThemedView>
          <ThemedView style={commonStyles.listItem.list}>
            {benefits.map((benefit: string, index: number) => (
              <ThemedView key={index} style={commonStyles.listItem.listItem}>
                <ThemedView style={[commonStyles.listItem.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
                <ThemedLanguageText variant="secondary" size="medium" fontFamily="regional_secondary" style={commonStyles.listItem.itemText}>
                  {benefit}
                </ThemedLanguageText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedCard>
      </ScrollView>
    </ThemedView>
  );
};
