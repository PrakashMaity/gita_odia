import { createErrorAlert, createSuccessAlert, createConfirmAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import i18n from '@/lib/i18n';
import { useFavoriteStore } from '@/store';
import { convertLanguageToEnglish } from '@/features/bookmarks/utils/bookmarkUtils';
import { router } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook for favorite operations
 * Follows Single Responsibility Principle - handles all favorite-related business logic
 */
export const useFavoriteOperations = () => {
  const { removeFavorite, clearAllFavorites } = useFavoriteStore();
  const { showAlert, AlertComponent } = useCustomAlert();

  const handleRemoveFavorite = useCallback(async (verseId: string) => {
    try {
      await removeFavorite(verseId);
      showAlert(createSuccessAlert(i18n.t('favorite.removed'), i18n.t('favorite.removed')));
    } catch (error) {
      console.error('Error removing favorite:', error);
      showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('favorite.error')));
    }
  }, [removeFavorite, showAlert]);

  const handleFavoritePress = useCallback((chapterId: string, verseNumber: string) => {
    const englishVerse = convertLanguageToEnglish(verseNumber);
    router.push(`/chapter/${chapterId}?verse=${englishVerse}`);
  }, []);

  const handleRemoveAllFavorites = useCallback(() => {
    showAlert(createConfirmAlert(
      i18n.t('favorite.clearAll'),
      i18n.t('favorite.clearAllConfirm'),
      async () => {
        try {
          await clearAllFavorites();
          showAlert(createSuccessAlert(i18n.t('common.success'), i18n.t('favorite.clearAllSuccess')));
        } catch (error) {
          console.error('Error clearing all favorites:', error);
          showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('favorite.error')));
        }
      }
    ));
  }, [clearAllFavorites, showAlert]);

  return {
    handleRemoveFavorite,
    handleFavoritePress,
    handleRemoveAllFavorites,
    AlertComponent,
  };
};

