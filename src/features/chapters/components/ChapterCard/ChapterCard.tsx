import { useSemanticColors } from '@/hooks/useSemanticColors';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { ChapterImages } from '@/lib/utils/assets';
import { ChapterData } from '@/store';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';

interface ChapterCardProps {
  chapter: ChapterData;
  progressPercentage: number;
  onPress: (chapterId: string) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = React.memo(({
  chapter,
  progressPercentage,
  onPress,
}) => {
  const { colors } = useSemanticColors();
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
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

  const handlePress = useCallback(() => {
    onPress(chapterInfo.id);
  }, [onPress, chapterInfo.id]);

  return (
    <Pressable
      onPress={handlePress}
      className="w-full mb-4 active:opacity-80"
    >
      <Box
        className="w-full rounded-[24px] p-3 border border-primary-100/50 shadow-sm overflow-hidden relative flex-row items-center"
        style={{ backgroundColor: theme.background.primary }}
      >
        <Box className="absolute -right-4 -bottom-4 opacity-[0.03]" pointerEvents="none">
          <FontAwesome5 name="book-open" size={90} color="#000" />
        </Box>

        <Box className="w-[84px] h-[84px] rounded-[18px] mr-4 overflow-hidden border border-primary-100 shadow-sm">
          <Image
            source={coverImage}
            alt={chapterInfo.title || 'Chapter cover'}
            className="w-full h-full"
            resizeMode="cover"
          />
        </Box>

        <VStack className="flex-1 justify-center py-1">
          <Text
            className="text-neutral-800 font-extrabold text-[16px] mb-1 tracking-tight pr-4"
            style={{ fontFamily: fonts.regional_secondary }}
            numberOfLines={2}
          >
            {chapterInfo.title}
          </Text>

          {chapterInfo.subtitle && chapterInfo.subtitle !== chapterInfo.title && (
            <Text
              className="text-neutral-500 text-[12px] mb-2 pr-4 leading-4"
              style={{ fontFamily: fonts.regional_secondary }}
              numberOfLines={2}
            >
              {chapterInfo.subtitle} • {chapterInfo.totalVerses} {i18n.t('chapter.verses')}
            </Text>
          )}

          {progressPercentage > 0 && (
            <VStack className="mt-1 w-[90%]">
              <HStack className="justify-between mb-1.5 items-center">
                <Text className="text-[10px] text-primary-600 font-bold" style={{ fontFamily: fonts.regional_secondary }}>
                  {i18n.t('progress.readingProgress') || 'Progress'}
                </Text>
                <Text className="text-[10px] text-primary-600 font-bold" style={{ fontFamily: fonts.regional_secondary }}>
                  {Math.round(progressPercentage)}%
                </Text>
              </HStack>
              <Box className="h-1.5 w-full bg-primary-100 rounded-full overflow-hidden">
                <Box
                  className="h-full rounded-full"
                  style={{ width: `${progressPercentage}%`, backgroundColor: theme.status.success || '#ea580c' }}
                />
              </Box>
            </VStack>
          )}
        </VStack>

        <Box className="w-8 h-8 rounded-full items-center justify-center bg-primary-50 mr-1 ml-2">
          <MaterialIcons name="arrow-forward-ios" size={14} color={colors.primary600} />
        </Box>
      </Box>
    </Pressable>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.chapter.chapter.id === nextProps.chapter.chapter.id &&
    prevProps.progressPercentage === nextProps.progressPercentage
  );
});

ChapterCard.displayName = 'ChapterCard';
