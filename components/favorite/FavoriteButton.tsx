import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useFavoriteStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FavoriteButtonProps {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}

export default function FavoriteButton({
  verseId,
  chapterId,
  chapterNumber,
  verseNumber,
  verseText,
  onFavoriteChange,
  onAlert,
}: FavoriteButtonProps) {
  const { theme } = useTheme();
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

  // Get current favorite status - this will re-run when favorites change
  const favoriteStatus = isFavorite(verseId);

  // Update parent component when favorite status changes
  useEffect(() => {
    onFavoriteChange?.(favoriteStatus);
  }, [favoriteStatus, onFavoriteChange]);

  const handleFavoriteToggle = async () => {
    try {
      if (favoriteStatus) {
        // Remove favorite
        await removeFavorite(verseId);
        onAlert?.(i18n.t('favorite.removed'), i18n.t('favorite.removed'), 'success');
      } else {
        // Add favorite
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
      <ThemedView style={styles.container}>
        <ThemedText style={{ ...styles.loadingText, color: theme.text.secondary }}>
          {i18n.t('common.loading')}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleFavoriteToggle}
   
    >
      <Ionicons 
        name={favoriteStatus ? "heart" : "heart-outline"} 
        size={SIZES.icon.xxl} 
        color={favoriteStatus ? theme.status.error : theme.icon.secondary} 
      />
   
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
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 1,
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: SIZES.spacing.xs,
  },
});
