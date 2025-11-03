import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useFavoriteStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native';
import { PageHeader, EmptyState, LoadingState } from '@/components/shared';
import { FavoriteCard } from './components/FavoriteCard';
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
    <ThemedView variant="primary" style={styles.container}>
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
        <EmptyState
          icon={<Ionicons name="heart-outline" size={64} color={theme.icon.tertiary} />}
          title={i18n.t('favorite.noFavorites')}
          subtitle={i18n.t('favorite.favoriteHint')}
        />
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
  );
};
