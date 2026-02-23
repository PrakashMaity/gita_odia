import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { useFavoriteStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

interface FavoriteButtonProps {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  verseId,
  chapterId,
  chapterNumber,
  verseNumber,
  verseText,
  onFavoriteChange,
  onAlert,
}) => {
  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    isLoading
  } = useFavoriteStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const favoriteStatus = isFavorite(verseId);

  useEffect(() => {
    onFavoriteChange?.(favoriteStatus);
  }, [favoriteStatus, onFavoriteChange]);

  const handleFavoriteToggle = async () => {
    try {
      if (favoriteStatus) {
        await removeFavorite(verseId);
        onAlert?.(i18n.t('favorite.removed'), i18n.t('favorite.removed'), 'success');
      } else {
        await addFavorite(verseId, chapterId, chapterNumber, verseNumber, verseText);
        onAlert?.(i18n.t('favorite.added'), i18n.t('favorite.added'), 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      onAlert?.(i18n.t('common.error'), i18n.t('favorite.error'), 'error');
    }
  };

  if (loading || isLoading) {
    return (
      <Box className="p-2">
        <Text className="text-xs text-neutral-400">
          {i18n.t('common.loading')}
        </Text>
      </Box>
    );
  }

  return (
    <TouchableOpacity onPress={handleFavoriteToggle}>
      <Ionicons
        name={favoriteStatus ? "heart" : "heart-outline"}
        size={28}
        color={favoriteStatus ? '#ef4444' : '#9ca3af'}
      />
    </TouchableOpacity>
  );
};
