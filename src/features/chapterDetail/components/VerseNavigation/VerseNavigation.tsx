import { AppText } from '@/components/ui/AppText';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { BookmarkButton } from '@/features/bookmarks/components';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface VerseNavigationProps {
  currentVerse: number;
  totalVerses: number;
  currentVerseData: {
    id: string;
    verseNumber: string;
    Language: string;
  } | undefined;
  chapterId: string;
  chapterNumber: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const VerseNavigation: React.FC<VerseNavigationProps> = ({
  currentVerse,
  totalVerses,
  currentVerseData,
  chapterId,
  chapterNumber,
  onPrevious,
  onNext,
}) => {
  const theme = useThemeColors();

  const isFirstVerse = currentVerse <= 0;
  const isLastVerse = currentVerse >= totalVerses - 1;

  if (!currentVerseData) {
    return null;
  }

  return (
    <Box
      className="px-4 py-4 shadow-sm"
      style={{
        backgroundColor: theme.background.secondary,
        borderTopWidth: 1,
        borderTopColor: theme.border.primary + '20',
      }}
    >
      <HStack className="items-center justify-between">
        <Pressable
          onPress={onPrevious}
          disabled={isFirstVerse}
          className={`flex-row items-center px-4 py-2.5 rounded-[16px] shadow-sm active:opacity-70 ${isFirstVerse ? 'opacity-50' : ''}`}
          style={{
            backgroundColor: theme.background.primary,
            borderWidth: 1,
            borderColor: theme.border.primary + '30',
          }}
        >
          <Ionicons name="chevron-back" size={20} color={theme.icon.primary} />
          <AppText
            variant="secondary"
            bold
            className="ml-2"
            style={{ color: theme.text.primary }}
          >
            {i18n.t('common.previous')}
          </AppText>
        </Pressable>

        <Box
          className="w-12 h-12 rounded-[16px] items-center justify-center shadow-sm overflow-hidden"
          style={{
            backgroundColor: theme.background.primary,
            borderWidth: 1,
            borderColor: theme.border.primary + '30',
          }}
        >
          <BookmarkButton
            variant="icon"
            verseId={currentVerseData.id}
            chapterId={chapterId}
            chapterNumber={chapterNumber}
            verseNumber={currentVerseData.verseNumber}
            verseText={currentVerseData.Language}
          />
        </Box>

        <Pressable
          onPress={onNext}
          disabled={isLastVerse}
          className={`flex-row items-center px-4 py-2.5 rounded-[16px] shadow-sm active:opacity-70 ${isLastVerse ? 'opacity-50' : ''}`}
          style={{
            backgroundColor: theme.background.primary,
            borderWidth: 1,
            borderColor: theme.border.primary + '30',
          }}
        >
          <AppText
            variant="secondary"
            bold
            className="mr-2"
            style={{ color: theme.text.primary }}
          >
            {i18n.t('common.next')}
          </AppText>
          <Ionicons name="chevron-forward" size={20} color={theme.icon.primary} />
        </Pressable>
      </HStack>
    </Box>
  );
};
