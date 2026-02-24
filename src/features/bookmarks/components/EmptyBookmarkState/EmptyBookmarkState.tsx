import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

export const EmptyBookmarkState: React.FC = () => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  const handleBrowseChapters = () => {
    router.push('/(tabs)/chapters');
  };

  return (
    <ScrollView
      className="flex-1 px-4 mt-8"
      contentContainerStyle={{ paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack space="xl" className="items-center">
        {/* Decorative Icon Container */}
        <Box className="w-[120px] h-[120px] items-center justify-center relative mb-4">
          <Box
            className="w-[100px] h-[100px] rounded-full items-center justify-center"
            style={{ backgroundColor: theme.background.quaternary + '40' }}
          >
            <Ionicons name="bookmark-outline" size={40} color={theme.icon.tertiary} />
          </Box>
          <Box
            className="w-10 h-10 rounded-full items-center justify-center absolute -top-2 right-0 border-2 border-white"
            style={{ backgroundColor: theme.background.quaternary + '80' }}
          >
            <MaterialIcons name="auto-stories" size={20} color={theme.icon.secondary} />
          </Box>
          <Box
            className="w-12 h-12 rounded-full items-center justify-center absolute -bottom-2 left-0 border-2 border-white"
            style={{ backgroundColor: theme.background.primary, borderColor: theme.border.primary }}
          >
            <Ionicons name="library-outline" size={20} color={theme.icon.secondary} />
          </Box>
        </Box>

        {/* Text Headers */}
        <VStack space="sm" className="items-center w-full mb-2">
          <Text
            className="text-[28px] font-black tracking-tight text-neutral-800 text-center"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {i18n.t('bookmark.emptyState.title')}
          </Text>
          <Text
            className="text-[16px] font-medium text-neutral-500 text-center px-4 leading-6"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {i18n.t('bookmark.emptyState.subtitle')}
          </Text>
        </VStack>

        {/* Tips Card */}
        <Box
          className="w-full bg-white rounded-[24px] p-5 shadow-sm border border-primary-100/50"
          style={{ backgroundColor: theme.background.primary }}
        >
          <HStack className="items-center mb-4">
            <Box
              className="w-1.5 h-6 rounded-full mr-3"
              style={{ backgroundColor: theme.icon.primary }}
            />
            <Text
              className="text-[18px] font-black tracking-tight text-neutral-800"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('bookmark.emptyState.tipsTitle')}
            </Text>
          </HStack>

          <VStack space="md">
            {[
              i18n.t('bookmark.emptyState.tip1'),
              i18n.t('bookmark.emptyState.tip2'),
              i18n.t('bookmark.emptyState.tip3'),
            ].map((tip, index) => (
              <HStack key={index} className="items-start">
                <Box
                  className="w-6 h-6 rounded-full mt-0.5 items-center justify-center mr-3"
                  style={{ backgroundColor: theme.status.success + '20' }}
                >
                  <Ionicons name="checkmark" size={12} color={theme.status.success} />
                </Box>
                <Text
                  className="flex-1 text-[15px] leading-6 text-neutral-600"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {tip}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Action Button */}
        <Pressable
          onPress={handleBrowseChapters}
          className="w-full px-5 py-4 rounded-[20px] shadow-sm flex-row items-center justify-between active:opacity-80"
          style={{ backgroundColor: theme.status.success }}
        >
          <HStack space="md" className="items-center">
            <Ionicons name="book-outline" size={24} color="#fff" />
            <Text
              className="text-[18px] font-black tracking-tight text-white"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('bookmark.emptyState.browseButton')}
            </Text>
          </HStack>
          <Box className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Box>
        </Pressable>

        {/* Quote Card */}
        <Box
          className="w-full rounded-[24px] p-6 shadow-sm border border-primary-100/50 mt-4 relative overflow-hidden items-center justify-center"
          style={{ backgroundColor: theme.background.primary }}
        >
          <Box className="absolute -top-4 -left-4 opacity-[0.05]" pointerEvents="none">
            <MaterialIcons name="format-quote" size={120} color="#000" />
          </Box>
          <Text
            className="text-[16px] font-medium leading-7 text-neutral-700 text-center italic"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            "{i18n.t('bookmark.emptyState.quote')}"
          </Text>
        </Box>

      </VStack>
    </ScrollView>
  );
};
