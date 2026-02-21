import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { useBookmarkStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './BookmarkButton.styles';

interface BookmarkButtonProps {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  verseId,
  chapterId,
  chapterNumber,
  verseNumber,
  verseText,
  onBookmarkChange,
  onAlert,
}) => {
  const { theme } = useTheme();
  const { 
    isBookmarked, 
    addBookmark, 
    removeBookmark, 
    isLoading 
  } = useBookmarkStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const bookmarkStatus = isBookmarked(verseId);

  useEffect(() => {
    onBookmarkChange?.(bookmarkStatus);
  }, [bookmarkStatus, onBookmarkChange]);

  const handleBookmarkToggle = async () => {
    try {
      if (bookmarkStatus) {
        await removeBookmark(verseId);
        onAlert?.(i18n.t('bookmark.removed'), i18n.t('bookmark.removed'), 'success');
      } else {
        await addBookmark(verseId, chapterId, chapterNumber, verseNumber, verseText);
        onAlert?.(i18n.t('bookmark.added'), i18n.t('bookmark.added'), 'success');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      onAlert?.(i18n.t('common.error'), i18n.t('bookmark.error'), 'error');
    }
  };

  if (loading || isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ ...styles.loadingText, color: theme.text.secondary }}>
          {i18n.t('common.loading')}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleBookmarkToggle}
      style={[
        styles.bookmarkButton,
        {
          backgroundColor: bookmarkStatus ? theme.button.primary.background : theme.background.secondary,
          borderColor: bookmarkStatus ? theme.button.primary.background : theme.border.primary,
        }
      ]}
    >
      <Ionicons 
        name={bookmarkStatus ? "checkmark" : "bookmark-outline"} 
        size={20} 
        color={bookmarkStatus ? theme.icon.success : theme.icon.secondary} 
      />
      <ThemedLanguageText 
        fontFamily='regional_secondary'
        variant='primary'
        size='small'
        style={{
          ...styles.bookmarkText,
          color: bookmarkStatus ? theme.button.primary.text : theme.text.primary
        }}
      >
        {bookmarkStatus ? i18n.t('bookmark.remove') : i18n.t('bookmark.add')}
      </ThemedLanguageText>
    </TouchableOpacity>
  );
};
