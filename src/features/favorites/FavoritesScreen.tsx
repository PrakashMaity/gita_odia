import { BannerAdComponent } from '@/components/ads';
import { LoadingState } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useFavoriteStore } from '@/store';
import { LayoutImages } from '@/lib/utils/assets';
import { ImageBackground, ScrollView } from 'react-native';
import { EmptyFavoriteState } from './components/EmptyFavoriteState';
import { FavoriteCard } from './components/FavoriteCard';
import { FavoritesHeader } from './components/FavoritesHeader';
import { styles } from './FavoritesScreen.styles';
import { useFavoriteOperations } from './hooks/useFavoriteOperations';

export const FavoritesScreen: React.FC = () => {
  const theme = useThemeColors();
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
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        {AlertComponent}
        
        <FavoritesHeader 
          favoriteCount={sortedFavorites.length}
          onClearAll={handleRemoveAllFavorites}
        />

        {sortedFavorites.length === 0 ? (
          <EmptyFavoriteState />
        ) : (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
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

            {/* Banner Ad */}
            <ThemedView style={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg }}>
              <BannerAdComponent />
            </ThemedView>
          </ScrollView>
        )}
      </ThemedView>
    </ImageBackground>
  );
};
