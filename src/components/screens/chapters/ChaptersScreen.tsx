import { MangalacharanSectionCard } from '@/components/screens/mangalacharan/components/MangalacharanSectionCard';
import { LoadingState } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useChapterStore } from '@/store';
import { LayoutImages } from '@/utils/assets';
import React from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { styles } from './ChaptersScreen.styles';
import { ChapterCard } from './components';
import { ChaptersHeader } from './components/ChaptersHeader';
import { useChapterProgress } from './hooks/useChapterProgress';
import { useChaptersOperations } from './hooks/useChaptersOperations';

export const ChaptersScreen: React.FC = () => {
  const { chapters, isLoading } = useChapterStore();
  const { progressLoading, getChapterProgressPercentage } = useChapterProgress();
  const { handleChapterPress } = useChaptersOperations();
  const theme = useThemeColors();

  if (isLoading || progressLoading) {
    return <LoadingState message={i18n.t('chapter.chaptersLoading')} />;
  }

  return (
    <ImageBackground
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <ChaptersHeader />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Intro Section */}
          <MangalacharanSectionCard
            content={i18n.t('chapter.intro')}
            variant="intro"
          />

          {/* Chapters List */}
          <ThemedView style={styles.section}>
            <ThemedView style={styles.chaptersContainer}>
              {chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.chapter.id}
                  chapter={chapter}
                  progressPercentage={getChapterProgressPercentage(chapter)}
                  onPress={handleChapterPress}
                />
              ))}
            </ThemedView>
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
                {i18n.t('chapter.motivationTitle')}
              </ThemedLanguageText>
            </ThemedView>
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              style={styles.motivationText}
              fontFamily="regional_secondary"
            >
              {i18n.t('chapter.motivationText')}
            </ThemedLanguageText>
          </ThemedCard>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
