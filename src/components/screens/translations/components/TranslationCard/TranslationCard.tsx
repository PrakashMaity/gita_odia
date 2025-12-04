import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { TranslationData } from '@/store';
import { ChapterImages } from '@/utils/assets';
import { SIZES } from '@/rootconstants/sizes';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './TranslationCard.styles';

interface TranslationCardProps {
  translation: TranslationData;
  onPress: (chapterId: string) => void;
}

export const TranslationCard: React.FC<TranslationCardProps> = React.memo(({
  translation,
  onPress,
}) => {
  const { theme } = useTheme();
  const { chapter } = translation;

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

    const chapterNumber = normalizeNumber(chapter.number) || normalizeNumber(chapter.id);

    if (Number.isNaN(chapterNumber) || chapterNumber <= 0) {
      return ChapterImages[0];
    }

    return ChapterImages[(chapterNumber - 1) % ChapterImages.length];
  }, [chapter.id, chapter.number]);

  const handlePress = useCallback(() => {
    onPress(chapter.id);
  }, [onPress, chapter.id]);

  return (
    <TouchableOpacity
      key={chapter.id}
      onPress={handlePress}
    >
      <ThemedCard 
        style={[styles.card, { padding: 0, borderColor: theme.border.secondary }]} 
        pattern="mandala" 
        patternOpacity={0.05}
      >
        <ThemedView style={styles.content}>
          <ThemedView style={styles.coverWrapper}>
            <Image 
              source={coverImage} 
              style={styles.coverImage} 
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </ThemedView>

          <ThemedView style={styles.textContainer}>
            {chapter.subtitle && chapter.subtitle !== chapter.title && (
              <ThemedLanguageText
                variant="primary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.subtitle}
                numberOfLines={1}
              >
                {chapter.subtitle} || {chapter.totalVerses} {i18n.t('verse.translation')}
              </ThemedLanguageText>
            )}

            <ThemedLanguageText
              variant="secondary"
              size="small"
              fontFamily="regional_secondary"
              style={styles.translationInfo}
              numberOfLines={1}
            >
              {chapter.title}
            </ThemedLanguageText>
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
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return prevProps.translation.chapter.id === nextProps.translation.chapter.id;
});

