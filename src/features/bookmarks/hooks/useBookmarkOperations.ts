import { createConfirmAlert, createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import i18n from '@/lib/i18n';
import { useBookmarkStore } from '@/store';
import { router } from 'expo-router';
import { useCallback, useRef } from 'react';
import { convertLanguageToEnglish } from '../utils/bookmarkUtils';

/**
 * Custom hook for bookmark operations
 * Follows Single Responsibility Principle - handles all bookmark-related business logic
 */
export const useBookmarkOperations = () => {
  const { removeBookmark, clearAllBookmarks } = useBookmarkStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { showAd, isLoaded } = useInterstitialAd();
  const openCountRef = useRef(0);

  const handleRemoveBookmark = useCallback((verseId: string) => {
    showAlert(createConfirmAlert(
      i18n.t('bookmark.removeTitle') || i18n.t('common.confirm'),
      i18n.t('bookmark.removeConfirm') || i18n.t('bookmark.deleteConfirm'),
      async () => {
        try {
          await removeBookmark(verseId);
          showAlert(createSuccessAlert(i18n.t('bookmark.removed'), i18n.t('bookmark.removed')));
        } catch (error) {
          console.error('Error removing bookmark:', error);
          showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('bookmark.error')));
        }
      }
    ));
  }, [removeBookmark, showAlert]);

  const handleBookmarkPress = useCallback((chapterId: string, verseNumber: string) => {
    const englishVerse = convertLanguageToEnglish(verseNumber);
    router.push(`/chapter/${chapterId}?verse=${englishVerse}`);
    openCountRef.current += 1;
    if (isLoaded) {
      showAd();
    }
  }, [isLoaded, showAd]);

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
