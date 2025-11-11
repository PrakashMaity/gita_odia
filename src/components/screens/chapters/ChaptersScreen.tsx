import { LoadingState } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import i18n from '@/i18n';
import { useChapterStore } from '@/store';
import { LayoutImages } from '@/utils/assets';
import { ImageBackground, ScrollView } from 'react-native';
import { styles } from './ChaptersScreen.styles';
import { ChapterCard } from './components/ChapterCard';
import { ChaptersHeader } from './components/ChaptersHeader';
import { useChapterProgress } from './hooks/useChapterProgress';
import { useChaptersOperations } from './hooks/useChaptersOperations';

export const ChaptersScreen: React.FC = () => {
  const { chapters, isLoading } = useChapterStore();
  const { progressLoading, getChapterProgressPercentage } = useChapterProgress();
  const { handleChapterPress } = useChaptersOperations();

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
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};


