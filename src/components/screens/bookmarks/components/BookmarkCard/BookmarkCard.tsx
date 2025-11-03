import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Bookmark } from '@/store';
import { formatFullDate } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './BookmarkCard.styles';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  onPress: (chapterId: string, verseNumber: string) => void;
  onDelete: (verseId: string) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  index,
  onPress,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      key={`${bookmark.verseId}-${index}`}
      onPress={() => onPress(bookmark.chapterId, bookmark.verseNumber)}
      style={styles.container}
    >
      <ThemedCard style={styles.card}>
        <TouchableOpacity
          onPress={() => onDelete(bookmark.verseId)}
          style={[styles.deleteButton, { backgroundColor: theme.background.quaternary }]}
        >
          <Ionicons name="cut" size={SIZES.icon.xs} color={theme.icon.error} />
        </TouchableOpacity>

        <ThemedView style={[styles.iconContainer, { 
          backgroundColor: theme.background.tertiary,
        }]}>
          <ThemedLanguageText 
            variant="primary" 
            size="large" 
            fontFamily="regional_primary"
          >
            {bookmark.chapterNumber}
          </ThemedLanguageText>
        </ThemedView>

        <ThemedView style={styles.textContainer}>
          <ThemedLanguageText
            variant="primary"
            size="medium"
            fontFamily="regional_secondary"
            numberOfLines={2}
          >
            {i18n.t('chapter.chapter')} {bookmark.chapterNumber} || {i18n.t('verse.verse')} {bookmark.verseNumber}
          </ThemedLanguageText>

          <ThemedView style={styles.bookmarkInfo}>
            <ThemedLanguageText 
              variant="secondary" 
              size="small" 
              fontFamily="regional_secondary"
              style={styles.bookmarkDate}
            >
              ({formatFullDate(bookmark.timestamp)})
            </ThemedLanguageText>
          </ThemedView>

          <ThemedLanguageText 
            variant="secondary"
            size="small"
            fontFamily="regional_secondary"
            style={styles.verseText}
            numberOfLines={3}
          >
            {bookmark.verseText}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );
};

