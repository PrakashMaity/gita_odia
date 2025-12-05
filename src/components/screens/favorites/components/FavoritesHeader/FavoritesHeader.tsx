import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FavoriteMenu } from '../FavoriteCard/FavoriteMenu';
import { styles } from './FavoritesHeader.styles';

interface FavoritesHeaderProps {
  favoriteCount: number;
  onClearAll?: () => void;
}

export const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({
  favoriteCount,
  onClearAll,
}) => {
  const theme = useThemeColors();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <ScreenHeader
        title={i18n.t('favorite.favorites')}
        containerStyle={{ backgroundColor: theme.background.secondary }}
        rightContent={
          <ThemedView style={styles.headerActions}>
            {favoriteCount > 0 && (
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
      
      <FavoriteMenu
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
