import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { TranslationData, useTranslationStore } from '@/store';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { PageHeader } from '../shared/PageHeader';
import { LoadingState } from '../shared/LoadingState';
import { styles } from './TranslationsScreen.styles';

export const TranslationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { translations, isLoading, loadAllTranslations } = useTranslationStore();

  useEffect(() => {
    loadAllTranslations();
  }, [loadAllTranslations]);

  const handleTranslationPress = (chapterId: string) => {
    router.push(`/translation/${chapterId}`);
  };

  const renderTranslationCard = (translation: TranslationData) => {
    const { chapter } = translation;

    return (
      <TouchableOpacity
        key={chapter.id}
        onPress={() => handleTranslationPress(chapter.id)}
        style={styles.translationCardContainer}
      >
        <ThemedCard style={[styles.translationCard]} pattern='mandala' patternOpacity={0.05}>
          <ThemedView style={{flexDirection: 'row'}}>
            <ThemedView style={[styles.iconContainer, {
              backgroundColor: theme.background.tertiary,
            }]}>
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
                style={styles.chapterNumber}
              >
                {chapter.number}
              </ThemedLanguageText>
            </ThemedView>

            <ThemedView style={styles.textContainer}>
              {chapter.subtitle && chapter.subtitle !== chapter.title && (
                <ThemedLanguageText
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.chapterSubtitle}
                  numberOfLines={1}
                >
                  {chapter.subtitle}
                </ThemedLanguageText>
              )}

              <ThemedView style={styles.chapterInfo}>
                <ThemedLanguageText
                  variant="secondary"
                  size="small"
                  fontFamily="regional_secondary"
                  style={styles.verseCount}
                >
                  {chapter.totalVerses} {i18n.t('verse.translation')}
                </ThemedLanguageText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.quaternary }]}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={SIZES.icon.xs}
                color={theme.icon.quaternary}
              />
            </ThemedView>
          </ThemedView>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingState message={i18n.t('translations.loading')} />;
  }

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern width={width} height={height} />

      <ThemedCard variant='transparent' style={styles.headerCard}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.xl} color={theme.icon.primary} />
        </TouchableOpacity>

        <ThemedLanguageText
          variant="primary"
          size="title"
          fontFamily="regional_secondary"
          style={styles.title}
        >
          {i18n.t('menu.translations')}
        </ThemedLanguageText>
        <ThemedView style={styles.headerActions}>
          <ThemedView style={[styles.actionButton, { borderColor: theme.border.primary }]}>
            <MaterialIcons
              name="translate"
              size={SIZES.icon.md}
              color={theme.icon.primary}
            />
          </ThemedView>
        </ThemedView>
      </ThemedCard>

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
            {translations.map(renderTranslationCard)}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};
