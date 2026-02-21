import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { ChapterImages } from '@/lib/utils/assets';
import { TranslationData } from '@/store';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

interface TranslationCardProps {
  translation: TranslationData;
  onPress: (chapterId: string) => void;
}

export const TranslationCard: React.FC<TranslationCardProps> = React.memo(({
  translation,
  onPress,
}) => {
  const theme = useThemeColors();
  const { chapter } = translation;

  const coverImage = useMemo(() => {
    const normalizeNumber = (value: string | number | undefined) => {
      if (typeof value === 'number') {
        return value;
      }
      if (!value) return NaN;

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
      activeOpacity={0.7}
      onPress={handlePress}
      className="mb-4"
    >
      <Box
        className="rounded-[24px] overflow-hidden border border-amber-100/40 p-3 shadow-sm"
        style={{ backgroundColor: theme.background.primary }}
      >
        <HStack className="items-center">
          {/* Cover Image */}
          <Box className="w-[72px] h-[72px] rounded-[16px] overflow-hidden bg-neutral-100 mr-4 shrink-0">
            <Image
              source={coverImage}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </Box>

          {/* Text Content */}
          <VStack className="flex-1 justify-center">
            {chapter.subtitle && chapter.subtitle !== chapter.title && (
              <Text
                className="text-[15px] font-bold text-neutral-800 leading-tight mb-1 tracking-tight"
                numberOfLines={1}
              >
                {chapter.subtitle} • {chapter.totalVerses} {i18n.t('verse.translation')}
              </Text>
            )}
            <Text
              className="text-[13px] text-neutral-500 leading-tight"
              numberOfLines={1}
            >
              {chapter.title}
            </Text>
          </VStack>

          {/* Arrow */}
          <Box
            className="w-8 h-8 rounded-full items-center justify-center shrink-0 ml-3 border border-amber-100/50"
            style={{ backgroundColor: theme.background.secondary }}
          >
            <MaterialIcons
              name="arrow-forward-ios"
              size={12}
              color={theme.icon.primary}
            />
          </Box>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return prevProps.translation.chapter.id === nextProps.translation.chapter.id;
});
