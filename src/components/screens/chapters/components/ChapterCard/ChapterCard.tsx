import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedLinearProgress } from '@/components/ui/ThemedLinearProgress';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { ChapterData } from '@/store';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './ChapterCard.styles';

interface ChapterCardProps {
  chapter: ChapterData;
  progressPercentage: number;
  onPress: (chapterId: string) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  progressPercentage,
  onPress,
}) => {
  const { theme } = useTheme();
  const { chapter: chapterInfo } = chapter;

  return (
    <TouchableOpacity
      key={chapterInfo.id}
      onPress={() => onPress(chapterInfo.id)}
    >
      <ThemedCard style={styles.card} pattern='mandala' patternOpacity={0.05}>
        <ThemedView style={styles.content}>
          <ThemedView style={[styles.iconContainer, {
            backgroundColor: theme.background.tertiary,
          }]}>
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
            >
              {chapterInfo.number}
            </ThemedLanguageText>
          </ThemedView>

          <ThemedView style={styles.textContainer}>
            {chapterInfo.subtitle && chapterInfo.subtitle !== chapterInfo.title && (
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.subtitle}
                numberOfLines={1}
              >
                {chapterInfo.subtitle}
              </ThemedLanguageText>
            )}

            <ThemedView style={styles.info}>
              <ThemedLanguageText
                variant="secondary"
                size="small"
                fontFamily="regional_secondary"
                style={styles.verseCount}
              >
                {chapterInfo.totalVerses} {i18n.t('chapter.verses')}
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

        {progressPercentage > 0 && (
          <>
            <ThemedView style={styles.progressSpacer} />
            <ThemedView>
              <ThemedLinearProgress
                progress={progressPercentage / 100}
                height={20}
                variant="primary"
                showPercentage={false}
              >
                <ThemedLanguageText
                  variant="tertiary"
                  size="xs"
                  fontFamily="regional_secondary"
                  style={styles.progressText}
                >
                  {progressPercentage}%
                </ThemedLanguageText>
              </ThemedLinearProgress>
            </ThemedView>
          </>
        )}
      </ThemedCard>
    </TouchableOpacity>
  );
};

