import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
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
  const theme = useThemeColors();

  return (
    <ScreenHeader
      title={i18n.t('bookmark.bookmarks')}
      containerStyle={{ backgroundColor: theme.background.secondary }}
      rightContent={
        <ThemedView style={styles.headerActions}>
          <ThemedView style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}>
            <BookmarkIcon
              size={SIZES.icon.md}
              focused={true}
              showBadge={true}
              badgeSize="medium"
            />
          </ThemedView>

          {bookmarkCount > 0 && (
            <TouchableOpacity
              onPress={onClearAll}
              style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
            >
              <Ionicons
                name="trash-outline"
                size={SIZES.icon.md}
                color={theme.icon.error}
              />
            </TouchableOpacity>
          )}
        </ThemedView>
      }
    />
  );
};

