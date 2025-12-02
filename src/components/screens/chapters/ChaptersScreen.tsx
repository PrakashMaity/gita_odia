import { LoadingState } from '@/components/shared';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer/ResponsiveContainer';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';
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
  const layout = useDeviceLayout();

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
        <ResponsiveContainer contentStyle={styles.headerWrapper}>
          <ChaptersHeader />
        </ResponsiveContainer>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: layout.sectionSpacing },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ResponsiveContainer contentStyle={styles.contentStack}>
            <ThemedView style={styles.section}>
              <ThemedView
                style={[
                  styles.chaptersContainer,
                  layout.gridColumns > 1 && styles.chaptersGrid,
                ]}
              >
                {chapters.map((chapter) => (
                  <ThemedView
                    key={chapter.chapter.id}
                    style={[
                      styles.chapterItem,
                      layout.gridColumns > 1 && styles.chapterItemGrid,
                      layout.gridColumns > 1 && {
                        width: layout.gridItemWidthPercent,
                        maxWidth: layout.gridItemWidthPercent,
                      },
                    ]}
                  >
                    <ChapterCard
                      chapter={chapter}
                      progressPercentage={getChapterProgressPercentage(chapter)}
                      onPress={handleChapterPress}
                    />
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          </ResponsiveContainer>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};


