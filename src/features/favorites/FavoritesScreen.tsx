import { BannerAdComponent } from '@/components/ads';
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
            className="flex-row items-center justify-between p-5 rounded-[24px] mb-6 shadow-sm border border-rose-100/50"
            style={{ backgroundColor: theme.background.primary }}
          >
            <HStack className="items-center">
              <Box
                className="w-2.5 h-8 rounded-full mr-4"
                style={{ backgroundColor: theme.status.error + '80' }}
              />
              <VStack>
                <Text
                  className="text-[14px] font-medium text-neutral-500 mb-0.5"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('favorite.yourFavorites')}
                </Text>
                <Text
                  className="text-[28px] font-black tracking-tight text-neutral-800"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {convertToLocalizedNumber(sortedFavorites.length.toString())}
                </Text>
              </VStack>
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

          {/* Banner Ad */}
          <Box className="w-full my-6 items-center flex">
            <BannerAdComponent />
          </Box>
        </ScrollView>
      )}
    </Box>
  );
};
