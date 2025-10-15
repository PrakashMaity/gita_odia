import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useBookmarkStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedLanguageText } from '../ui/ThemedLanguageText';

interface BookmarkButtonProps {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}



export default function BookmarkButton({
  verseId,
  chapterId,
  chapterNumber,
  verseNumber,
  verseText,
  onBookmarkChange,
  onAlert,
}: BookmarkButtonProps) {
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

  // Get current bookmark status - this will re-run when bookmarks change
  const bookmarkStatus = isBookmarked(verseId);



  // Update parent component when bookmark status changes
  useEffect(() => {
    onBookmarkChange?.(bookmarkStatus);
  }, [bookmarkStatus, onBookmarkChange]);

  const handleBookmarkToggle = async () => {
    try {
      if (bookmarkStatus) {
        // Remove bookmark
        await removeBookmark(verseId);
        onAlert?.(i18n.t('bookmark.removed'), i18n.t('bookmark.removed'), 'success');
      } else {
        // Add bookmark
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
        color={bookmarkStatus ? "#4CAF50" : theme.icon.secondary} 
      />
      <ThemedLanguageText 
        fontFamily='regional_secondary'
        variant='primary'
        size='small'
        style={{
        ...styles.bookmarkText,
        color: bookmarkStatus ? theme.button.primary.text : theme.text.primary
      }}>
        {bookmarkStatus ? i18n.t('bookmark.remove') : i18n.t('bookmark.add')}
      </ThemedLanguageText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SIZES.spacing.sm,
  },
  loadingText: {
    fontSize: 12,
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 1,
  },
  bookmarkText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: SIZES.spacing.xs,
  },
});
