import { BookmarkButton } from '@/features/bookmarks/components';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './VerseNavigation.styles';

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
  const { theme } = useTheme();
  const isFirstVerse = currentVerse <= 0;
  const isLastVerse = currentVerse >= totalVerses - 1;

  if (!currentVerseData) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={onPrevious}
        disabled={isFirstVerse}
        style={[
          styles.verseNavButton,
          {
            backgroundColor: theme.background.secondary,
            opacity: isFirstVerse ? 0.5 : 1
          }
        ]}
      >
        <Ionicons name="chevron-back" size={SIZES.icon.md} color={theme.icon.primary} />
        <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="medium">
          {i18n.t('common.previous')}
        </ThemedLanguageText>
      </TouchableOpacity>

      <BookmarkButton
        verseId={currentVerseData.id}
        chapterId={chapterId}
        chapterNumber={chapterNumber}
        verseNumber={currentVerseData.verseNumber}
        verseText={currentVerseData.Language}
      />

      <TouchableOpacity
        onPress={onNext}
        disabled={isLastVerse}
        style={[
          styles.verseNavButton,
          {
            backgroundColor: theme.background.secondary,
            opacity: isLastVerse ? 0.5 : 1
          }
        ]}
      >
        <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="medium">
          {i18n.t('common.next')}
        </ThemedLanguageText>
        <Ionicons name="chevron-forward" size={SIZES.icon.md} color={theme.icon.primary} />
      </TouchableOpacity>
    </ThemedView>
  );
};

