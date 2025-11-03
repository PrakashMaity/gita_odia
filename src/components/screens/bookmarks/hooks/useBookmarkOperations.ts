import { createErrorAlert, createSuccessAlert, createConfirmAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import i18n from '@/i18n';
import { useBookmarkStore } from '@/store';
import { convertLanguageToEnglish } from '../utils/bookmarkUtils';
import { router } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook for bookmark operations
 * Follows Single Responsibility Principle - handles all bookmark-related business logic
 */
export const useBookmarkOperations = () => {
  const { removeBookmark, clearAllBookmarks } = useBookmarkStore();
  const { showAlert, AlertComponent } = useCustomAlert();

  const handleRemoveBookmark = useCallback(async (verseId: string) => {
    try {
      await removeBookmark(verseId);
      showAlert(createSuccessAlert(i18n.t('bookmark.removed'), i18n.t('bookmark.removed')));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('bookmark.error')));
    }
  }, [removeBookmark, showAlert]);

  const handleBookmarkPress = useCallback((chapterId: string, verseNumber: string) => {
    const englishVerse = convertLanguageToEnglish(verseNumber);
    router.push(`/chapter/${chapterId}?verse=${englishVerse}`);
  }, []);

  const handleRemoveAllBookmarks = useCallback(() => {
    showAlert(createConfirmAlert(
      i18n.t('bookmark.clearAll'),
      i18n.t('bookmark.clearAllConfirm'),
      async () => {
        try {
          await clearAllBookmarks();
          showAlert(createSuccessAlert(i18n.t('common.success'), i18n.t('bookmark.clearAllSuccess')));
        } catch (error) {
          console.error('Error clearing all bookmarks:', error);
          showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('bookmark.error')));
        }
      }
    ));
  }, [clearAllBookmarks, showAlert]);

  return {
    handleRemoveBookmark,
    handleBookmarkPress,
    handleRemoveAllBookmarks,
    AlertComponent,
  };
};

