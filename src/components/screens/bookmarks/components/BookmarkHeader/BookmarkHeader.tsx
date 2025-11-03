import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './BookmarkHeader.styles';

interface BookmarkHeaderProps {
  bookmarkCount: number;
  onClearAll?: () => void;
}

export const BookmarkHeader: React.FC<BookmarkHeaderProps> = ({
  bookmarkCount,
  onClearAll,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedCard variant='transparent' style={styles.headerCard}>
      <ThemedLanguageText 
        variant="primary" 
        size="title" 
        fontFamily="regional_secondary"
        style={styles.title}
      >
        {i18n.t('bookmark.bookmarks')}
      </ThemedLanguageText>
      <ThemedView style={styles.headerActions}>
        <ThemedView style={[styles.actionButton, { borderColor: theme.border.primary }]}>
          <BookmarkIcon 
            size={SIZES.icon.md} 
            color={theme.icon.primary} 
            focused={true}
            showBadge={true}
            badgeSize="medium"
          />
        </ThemedView>
        {bookmarkCount > 0 && (
          <TouchableOpacity
            onPress={onClearAll}
            style={[styles.actionButton, { borderColor: theme.border.error }]}
          >
            <Ionicons name="trash-outline" size={SIZES.icon.md} color={theme.icon.error} />
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedCard>
  );
};

