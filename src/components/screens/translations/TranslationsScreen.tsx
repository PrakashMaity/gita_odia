import { LoadingState } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import i18n from '@/i18n';
import { useTranslationStore } from '@/store';
import { LayoutImages } from '@/utils/assets';
import { useEffect } from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { TranslationCard } from './components/TranslationCard';
import { TranslationsHeader } from './components/TranslationsHeader';
import { useTranslationsOperations } from './hooks/useTranslationsOperations';
import { styles } from './TranslationsScreen.styles';

export const TranslationsScreen: React.FC = () => {
  const { translations, isLoading, loadAllTranslations } = useTranslationStore();
  const { handleTranslationPress } = useTranslationsOperations();

  useEffect(() => {
    loadAllTranslations();
  }, [loadAllTranslations]);

  if (isLoading) {
    return <LoadingState message={i18n.t('translations.loading')} />;
  }

  return (
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <TranslationsHeader />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.translationsContainer}>
            {translations.map((translation) => (
              <TranslationCard
                key={translation.chapter.id}
                translation={translation}
                onPress={handleTranslationPress}
              />
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
