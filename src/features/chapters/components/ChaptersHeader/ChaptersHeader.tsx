import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ChaptersHeader: React.FC = React.memo(() => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="pb-4 px-4 border-b border-amber-900/10 shadow-sm z-10"
      style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(insets.top, 20) }}
    >
      <HStack className="items-center justify-between">
        <Pressable
          className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
        </Pressable>

        <Text
          className="text-[20px] font-black tracking-tight"
          style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
          numberOfLines={1}
        >
          {i18n.t('chapter.chapterTitle')}
        </Text>

        <Box className="w-10 h-10" />
      </HStack>
    </Box>
  );
});

ChaptersHeader.displayName = 'ChaptersHeader';
