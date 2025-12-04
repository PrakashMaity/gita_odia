import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useFavoriteStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { PageHeader, LoadingState } from '@/components/shared';
import { LayoutImages } from '@/utils/assets';
import { FavoriteCard } from './components/FavoriteCard';
import { EmptyFavoriteState } from './components/EmptyFavoriteState';
import { useFavoriteOperations } from './hooks/useFavoriteOperations';
import { styles } from './FavoritesScreen.styles';

export const FavoritesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { isLoading, getFavoritesSortedByDate } = useFavoriteStore();
  const { 
    handleRemoveFavorite, 
    handleFavoritePress, 
    handleRemoveAllFavorites,
    AlertComponent 
  } = useFavoriteOperations();
  
  const sortedFavorites = getFavoritesSortedByDate();

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  return (
    <ImageBackground
      source={LayoutImages.background2}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        {AlertComponent}
        <PageHeader
          title={i18n.t('favorite.favorites')}
          subtitle={sortedFavorites.length > 0 ? i18n.t('favorite.totalFavorites', { count: sortedFavorites.length }) : undefined}
          rightAction={
            sortedFavorites.length > 0 ? (
              <TouchableOpacity
                onPress={handleRemoveAllFavorites}
                style={styles.clearAllButton}
              >
                <Ionicons name="trash-outline" size={SIZES.icon.lg} color={theme.icon.error} />
              </TouchableOpacity>
            ) : undefined
          }
        />

        {sortedFavorites.length === 0 ? (
          <EmptyFavoriteState />
        ) : (
          <ScrollView 
            style={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
          >
            {sortedFavorites.map((favorite, index) => (
              <FavoriteCard
                key={`${favorite.verseId}-${index}`}
                favorite={favorite}
                index={index}
                onPress={handleFavoritePress}
                onDelete={handleRemoveFavorite}
              />
            ))}
          </ScrollView>
        )}
      </ThemedView>
    </ImageBackground>
  );
};
