import { BannerAdComponent } from '@/components/ads';
import { MangalacharanSectionCard } from '@/components/screens/mangalacharan/components/MangalacharanSectionCard';
import { LoadingState } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useTranslationStore } from '@/store';
import { LayoutImages } from '@/utils/assets';
import { useEffect } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { TranslationCard } from './components/TranslationCard';
import { TranslationsHeader } from './components/TranslationsHeader';
import { useTranslationsOperations } from './hooks/useTranslationsOperations';
import { styles } from './TranslationsScreen.styles';

export const TranslationsScreen: React.FC = () => {
  const { translations, isLoading, loadAllTranslations } = useTranslationStore();
  const { handleTranslationPress } = useTranslationsOperations();
  const theme = useThemeColors();

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
          {/* Intro Section */}
          <MangalacharanSectionCard
            content={i18n.t('translations.intro')}
            variant="intro"
          />

          {/* Translations List */}
          <ThemedView style={styles.translationsContainer}>
            {translations.map((translation) => (
              <View key={translation.chapter.id} style={styles.translationCardWrapper}>
                <TranslationCard
                  translation={translation}
                  onPress={handleTranslationPress}
                />
              </View>
            ))}
          </ThemedView>

          {/* Motivational Message - Footer */}
          <ThemedCard variant="card" style={styles.motivationCard} borderVariant="primary">
            <ThemedView style={styles.motivationHeader}>
              <ThemedView style={[styles.motivationIndicator, { backgroundColor: theme.status.success + '40' }]} />
              <ThemedLanguageText 
                variant="primary" 
                size="large" 
                fontFamily="regional_secondary"
                style={styles.motivationTitle}
              >
                {i18n.t('translations.motivationTitle')}
              </ThemedLanguageText>
            </ThemedView>
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              style={styles.motivationText}
              fontFamily="regional_secondary"
            >
              {i18n.t('translations.motivationText')}
            </ThemedLanguageText>
          </ThemedCard>

          {/* Banner Ad */}
          <ThemedView style={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg }}>
            <BannerAdComponent />
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
