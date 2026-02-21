import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { formatFullDate } from '@/lib/utils/dateUtils';
import { FavoriteVerse } from '@/store';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';

interface FavoriteCardProps {
  favorite: FavoriteVerse;
  index: number;
  onPress: (chapterId: string, verseNumber: string) => void;
  onDelete: (verseId: string) => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  index,
  onPress,
  onDelete,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  return (
    <Pressable
      key={`${favorite.verseId}-${index}`}
      onPress={() => onPress(favorite.chapterId, favorite.verseNumber)}
      className="bg-white rounded-[24px] shadow-sm mb-4 border border-rose-100/50 overflow-hidden active:opacity-80 flex-row"
      style={{ backgroundColor: theme.background.primary }}
    >
      <Box
        className="w-2"
        style={{ backgroundColor: theme.status.error + '60' }}
      />

      <VStack className="flex-1 p-5 relative overflow-hidden">
        <Box className="absolute -right-6 -bottom-6 opacity-[0.03]" pointerEvents="none">
          <MaterialIcons name="favorite" size={120} color="#000" />
        </Box>

        <HStack className="items-start justify-between mb-4">
          <HStack className="items-center flex-1 pr-4">
            <Box
              className="w-12 h-12 rounded-[16px] items-center justify-center mr-3"
              style={{ backgroundColor: theme.status.error + '20' }}
            >
              <Text
                className="text-[20px] font-bold"
                style={{ fontFamily: fonts.regional_primary, color: theme.status.error }}
              >
                {favorite.chapterNumber}
              </Text>
            </Box>

            <VStack className="flex-1">
              <Text
                className="text-[16px] font-black tracking-tight text-neutral-800"
                style={{ fontFamily: fonts.regional_secondary }}
                numberOfLines={1}
              >
                {i18n.t('chapter.chapter')} {favorite.chapterNumber}
              </Text>
              <Text
                className="text-[12px] font-medium mt-0.5"
                style={{ fontFamily: fonts.regional_secondary, color: theme.text.secondary }}
              >
                {i18n.t('verse.verse')} {favorite.verseNumber}
              </Text>
            </VStack>
          </HStack>

          <Pressable
            onPress={(e: any) => {
              e.stopPropagation();
              onDelete(favorite.verseId);
            }}
            className="w-10 h-10 rounded-full items-center justify-center border border-red-100/30"
            style={{ backgroundColor: theme.status.error + '10' }}
          >
            <Ionicons
              name="heart-dislike-outline"
              size={18}
              color={theme.status.error}
            />
          </Pressable>
        </HStack>

        <Text
          className="text-[15px] font-medium leading-6 text-neutral-600 mb-5"
          style={{ fontFamily: fonts.regional_secondary }}
          numberOfLines={4}
        >
          {favorite.verseText}
        </Text>

        <HStack className="items-center justify-between border-t border-rose-900/5 pt-4">
          <HStack className="items-center">
            <MaterialIcons
              name="favorite"
              size={14}
              color={theme.status.error + '90'}
              style={{ marginRight: 6 }}
            />
            <Text
              className="text-[12px] font-medium"
              style={{ fontFamily: fonts.regional_secondary, color: theme.text.tertiary }}
            >
              {formatFullDate(favorite.timestamp)}
            </Text>
          </HStack>

          <Box
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.background.secondary }}
          >
            <MaterialIcons
              name="arrow-forward-ios"
              size={12}
              color={theme.icon.secondary}
            />
          </Box>
        </HStack>

      </VStack>
    </Pressable>
  );
};
