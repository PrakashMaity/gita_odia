import { LoadingState } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MangalacharanSectionCard } from '@/features/mangalacharan/components/MangalacharanSectionCard';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { useChapterStore } from '@/store';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native';
import { ChapterCard } from './components';
import { ChaptersHeader } from './components/ChaptersHeader';
import { useChapterProgress } from './hooks/useChapterProgress';
import { useChaptersOperations } from './hooks/useChaptersOperations';

export const ChaptersScreen: React.FC = () => {
  const { chapters, isLoading } = useChapterStore();
  const { progressLoading, getChapterProgressPercentage } = useChapterProgress();
  const { handleChapterPress } = useChaptersOperations();
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  if (isLoading || progressLoading) {
    return <LoadingState message={i18n.t('chapter.chaptersLoading')} />;
  }

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      <ChaptersHeader />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="md" className="pt-4">

          <Box className="px-4">
            <Box className="mb-4 bg-white rounded-[24px] border border-amber-100 shadow-sm overflow-hidden"
              style={{ backgroundColor: theme.background.primary }}>
              <MangalacharanSectionCard
                content={i18n.t('chapter.intro')}
                variant="intro"
              />
            </Box>
          </Box>

          <VStack className="px-4">
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.chapter.id}
                chapter={chapter}
                progressPercentage={getChapterProgressPercentage(chapter)}
                onPress={handleChapterPress}
              />
            ))}
          </VStack>

          <Box className="px-4 mt-6">
            <Box
              className="rounded-[28px] p-6 border border-amber-100 shadow-sm justify-between relative overflow-hidden"
              style={{ backgroundColor: theme.background.primary }}
            >
              <Box className="absolute -bottom-4 -right-4 opacity-[0.05]" pointerEvents="none">
                <FontAwesome5 name="seedling" size={140} color="#000" />
              </Box>

              <HStack className="items-center mb-3">
                <Box className="w-10 h-10 bg-emerald-50 rounded-[16px] items-center justify-center mr-3 z-10">
                  <Box className="w-6 h-6 items-center justify-center">
                    <FontAwesome5 name="seedling" size={20} color="#10b981" />
                  </Box>
                </Box>
                <Text
                  className="text-neutral-800 font-extrabold text-[18px] tracking-tight flex-1 z-10"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('chapter.motivationTitle')}
                </Text>
              </HStack>
              <Text
                className="text-neutral-500 text-[14px] leading-5 z-10"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('chapter.motivationText')}
              </Text>
            </Box>
          </Box>

        </VStack>
      </ScrollView>
    </Box>
  );
};
