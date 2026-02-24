import { LoadingState } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { convertToLocalizedNumber } from '@/lib/utils/numberConverter';
import { useFavoriteStore } from '@/store';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { EmptyFavoriteState } from './components/EmptyFavoriteState';
import { FavoriteCard } from './components/FavoriteCard';
import { FavoritesHeader } from './components/FavoritesHeader';
import { useFavoriteOperations } from './hooks/useFavoriteOperations';

export const FavoritesScreen: React.FC = () => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const { isLoading, getFavoritesSortedByDate } = useFavoriteStore();
  const {
    handleRemoveFavorite,
    handleFavoritePress,
    handleRemoveAllFavorites,
    AlertComponent
  } = useFavoriteOperations();

  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const sortedFavorites = getFavoritesSortedByDate();

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  return (
    <Box key={refreshKey} className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      {AlertComponent}

      <FavoritesHeader
        favoriteCount={sortedFavorites.length}
        onClearAll={handleRemoveAllFavorites}
      />

      {sortedFavorites.length === 0 ? (
        <EmptyFavoriteState />
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 64 }}
        >
          {/* Stats Section */}
          <Box
            className="p-6 rounded-[28px] mb-8 shadow-sm border border-tertiary-100/50 relative overflow-hidden"
            style={{ backgroundColor: theme.background.primary }}
          >
            {/* Background Decorative Icon */}
            <Box className="absolute -right-8 -bottom-8 opacity-[0.03]" pointerEvents="none">
              <MaterialIcons name="favorite" size={160} color="#000" />
            </Box>

            <HStack className="items-center justify-between">
              <HStack className="items-center">
                <Box
                  className="w-1.5 h-12 rounded-full mr-5"
                  style={{ backgroundColor: theme.status.error }}
                />
                <VStack>
                  <Text
                    className="text-[14px] font-bold text-neutral-500 mb-1"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('favorite.yourFavorites').toUpperCase()}
                  </Text>
                  <HStack className="items-baseline">
                    <Text
                      className="text-[36px] font-black text-neutral-900 tracking-tighter"
                      style={{ fontFamily: fonts.regional_secondary }}
                    >
                      {convertToLocalizedNumber(sortedFavorites.length.toString())}
                    </Text>
                    <Text
                      className="text-[16px] font-bold text-neutral-400 ml-2"
                      style={{ fontFamily: fonts.regional_secondary }}
                    >
                      {i18n.t('favorite.favorites')}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <Box
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: theme.status.error + '15' }}
              >
                <MaterialIcons name="favorite-border" size={28} color={theme.status.error} />
              </Box>
            </HStack>
          </Box>

          <VStack className="mb-6">
            <HStack className="items-center mb-4 px-2">
              <Box
                className="w-1.5 h-6 rounded-full mr-3"
                style={{ backgroundColor: theme.status.error + '60' }}
              />
              <Text
                className="text-[20px] font-black tracking-tight text-neutral-800"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('favorite.recentFavorites')}
              </Text>
            </HStack>
          </VStack>

          <VStack space="md">
            {sortedFavorites.map((favorite, index) => (
              <FavoriteCard
                key={`${favorite.verseId}-${index}`}
                favorite={favorite}
                index={index}
                onPress={handleFavoritePress}
                onDelete={handleRemoveFavorite}
              />
            ))}
          </VStack>

        </ScrollView>
      )}
    </Box>
  );
};
