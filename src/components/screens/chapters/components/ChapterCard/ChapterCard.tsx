import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedLinearProgress } from '@/components/ui/ThemedLinearProgress';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { ChapterData } from '@/store';
import { ChapterImages } from '@/utils/assets';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Image, TouchableOpacity } from 'react-native';
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

  const coverImage = useMemo(() => {
    const normalizeNumber = (value: string | number | undefined) => {
      if (typeof value === 'number') {
        return value;
      }

      if (!value) {
        return NaN;
      }

      const banglaDigits = '০১২৩৪৫৬৭৮৯';
      const normalizedString = `${value}`.replace(/[০-৯]/g, (digit) => {
        const index = banglaDigits.indexOf(digit);
        return index >= 0 ? `${index}` : digit;
      });

      const parsed = Number(normalizedString);
      return Number.isNaN(parsed) ? NaN : parsed;
    };

    const chapterNumber = normalizeNumber(chapterInfo.number) || normalizeNumber(chapterInfo.id);

    if (Number.isNaN(chapterNumber) || chapterNumber <= 0) {
      return ChapterImages[0];
    }

    return ChapterImages[(chapterNumber - 1) % ChapterImages.length];
  }, [chapterInfo.id, chapterInfo.number]);

  return (
    <TouchableOpacity
      key={chapterInfo.id}
      onPress={() => onPress(chapterInfo.id)}
    >
      <ThemedCard  style={[styles.card,{padding:0}]} pattern='mandala' patternOpacity={0.05}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.coverWrapper}>
            <Image source={coverImage} style={styles.coverImage} resizeMode="cover" />
          </ThemedView>

          <ThemedView style={styles.textContainer}>
            {chapterInfo.subtitle && chapterInfo.subtitle !== chapterInfo.title && (
              <ThemedLanguageText
                variant="primary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.subtitle}
                numberOfLines={1}
              >
                {chapterInfo.subtitle} || {chapterInfo.totalVerses} {i18n.t('chapter.verses')}
              </ThemedLanguageText>
            )}
            {progressPercentage > 0 && (
          <>
            <ThemedView style={styles.progressSpacer} />
            <ThemedLinearProgress
              progress={progressPercentage / 100}
              height={20}
              variant="primary"
              showPercentage={false}
            />
          </>
        )}
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

