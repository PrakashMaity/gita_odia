import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { useTranslationStore } from '@/store';
import { useEffect } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { LoadingState } from '@/components/shared';
import { TranslationCard } from './components/TranslationCard';
import { TranslationsHeader } from './components/TranslationsHeader';
import { useTranslationsOperations } from './hooks/useTranslationsOperations';
import { styles } from './TranslationsScreen.styles';

export const TranslationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { translations, isLoading, loadAllTranslations } = useTranslationStore();
  const { handleTranslationPress } = useTranslationsOperations();

  useEffect(() => {
    loadAllTranslations();
  }, [loadAllTranslations]);

  if (isLoading) {
    return <LoadingState message={i18n.t('translations.loading')} />;
  }

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern width={width} height={height} />

      <TranslationsHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText
              variant="primary"
              size="xxl"
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('translations.sectionTitle')}
            </ThemedLanguageText>
          </ThemedView>
          <ThemedView style={styles.translationsContainer}>
            {translations.map((translation) => (
              <TranslationCard
                key={translation.chapter.id}
                translation={translation}
                onPress={handleTranslationPress}
              />
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};
