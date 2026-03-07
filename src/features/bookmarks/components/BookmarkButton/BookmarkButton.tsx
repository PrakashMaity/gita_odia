import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { useBookmarkStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

interface BookmarkButtonProps {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  variant?: 'icon' | 'full';
  onBookmarkChange?: (isBookmarked: boolean) => void;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  verseId,
  chapterId,
  chapterNumber,
  verseNumber,
  verseText,
  variant = 'full',
  onBookmarkChange,
  onAlert,
}) => {
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
      <Box className={variant === 'icon' ? '' : 'p-2'}>
        <Text className="text-xs text-primary-600">
          {variant === 'icon' ? '...' : i18n.t('common.loading')}
        </Text>
      </Box>
    );
  }

  const isIcon = variant === 'icon';

  return (
    <TouchableOpacity
      onPress={handleBookmarkToggle}
      activeOpacity={0.7}
      className={
        isIcon
          ? ''
          : `flex-row items-center px-4 py-2 rounded-xl border ${bookmarkStatus
            ? 'bg-primary-500 border-primary-500'
            : 'bg-white border-primary-200'
          }`
      }
    >
      <Ionicons
        name={bookmarkStatus ? "bookmark" : "bookmark-outline"}
        size={isIcon ? 24 : 20}
        color={bookmarkStatus ? (isIcon ? '#0f172a' : 'white') : '#64748b'}
      />
      {!isIcon && (
        <Text
          className={`text-sm font-medium ml-2 font-regional_secondary ${bookmarkStatus ? 'text-white' : 'text-primary-950'
            }`}
        >
          {bookmarkStatus ? i18n.t('bookmark.remove') : i18n.t('bookmark.add')}
        </Text>
      )}
    </TouchableOpacity>
  );
};
