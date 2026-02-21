import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookmarkMenu } from '../BookmarkCard/BookmarkMenu';

interface BookmarkHeaderProps {
  bookmarkCount: number;
  onClearAll?: () => void;
}

export const BookmarkHeader: React.FC<BookmarkHeaderProps> = ({
  bookmarkCount,
  onClearAll,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Box
        className="pb-4 px-4 border-b border-amber-900/10 shadow-sm z-10"
        style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(insets.top, 20) }}
      >
        <HStack className="items-center justify-between">
          <Pressable
            className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70 border border-amber-100/50"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
          </Pressable>

          <Text
            className="text-[20px] font-black tracking-tight flex-1 text-center"
            style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
            numberOfLines={1}
          >
            {i18n.t('bookmark.bookmarks')}
          </Text>

          <HStack space="xs" className="w-10 h-10 items-center justify-end">
            {bookmarkCount > 0 && (
              <Pressable
                onPress={() => setMenuVisible(true)}
                className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70 border border-amber-100/50"
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={theme.icon.secondary}
                />
              </Pressable>
            )}
          </HStack>
        </HStack>
      </Box>

      <BookmarkMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onDelete={() => {
          if (onClearAll) {
            onClearAll();
          }
          setMenuVisible(false);
        }}
        isHeaderMenu={true}
      />
    </>
  );
};
