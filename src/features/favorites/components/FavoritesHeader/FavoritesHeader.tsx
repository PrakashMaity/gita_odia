import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
        containerStyle={{ backgroundColor: theme.background.secondary }}
        leftContent={
          <ThemedView style={styles.leftContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backButton, { 
                backgroundColor: theme.background.secondary,
                borderColor: theme.border.primary 
              }]}
            >
              <Ionicons name="arrow-back" size={SIZES.icon.sm} color={theme.icon.primary} />
            </TouchableOpacity>
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.title}
            >
              {i18n.t('favorite.favorites')}
            </ThemedLanguageText>
          </ThemedView>
        }
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
