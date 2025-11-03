import { LoadingState } from '@/components/shared';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { useChapterStore } from '@/store';
import { Dimensions, ScrollView } from 'react-native';
import { styles } from './ChaptersScreen.styles';
import { ChapterCard } from './components/ChapterCard';
import { ChaptersHeader } from './components/ChaptersHeader';
import { useChapterProgress } from './hooks/useChapterProgress';
import { useChaptersOperations } from './hooks/useChaptersOperations';

export const ChaptersScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { chapters, isLoading } = useChapterStore();
  const { progressLoading, getChapterProgressPercentage } = useChapterProgress();
  const { handleChapterPress } = useChaptersOperations();

  if (isLoading || progressLoading) {
    return <LoadingState message={i18n.t('chapter.chaptersLoading')} />;
  }

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern width={width} height={height} />

      <ChaptersHeader />

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
              size="xl"
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('chapter.chapterTitle')}
            </ThemedLanguageText>
          </ThemedView>
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
      </ScrollView>
    </ThemedView>
  );
};


