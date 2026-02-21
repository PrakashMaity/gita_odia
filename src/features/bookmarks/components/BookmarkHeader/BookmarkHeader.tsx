import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { BookmarkMenu } from '../BookmarkCard/BookmarkMenu';
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
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <ScreenHeader
        title={i18n.t('bookmark.bookmarks')}
        containerStyle={{ backgroundColor: theme.background.secondary }}
        rightContent={
          <ThemedView style={styles.headerActions}>
            <ThemedView style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}>
              <BookmarkIcon
                size={SIZES.icon.xs}
                focused={true}
                showBadge={true}
                badgeSize="small"
              />
            </ThemedView>

            {bookmarkCount > 0 && (
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
              >
                <MaterialIcons
                  name="more-vert"
                  size={SIZES.icon.xs}
                  color={theme.icon.secondary}
                />
              </TouchableOpacity>
            )}
          </ThemedView>
        }
      />
      
      <BookmarkMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onDelete={() => {
          if (onClearAll) {
            onClearAll();
          }
          setMenuVisible(false);
        }}
        isHeaderMenu={true}
      />
    </>
  );
};

