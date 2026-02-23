import { PageHeader } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { LayoutImages } from '@/lib/utils/assets';
import React from 'react';
import { ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar, SearchResults, SearchTips } from './components';
import { useSearchNavigation } from './hooks/useSearchNavigation';
import { useSearchOperations } from './hooks/useSearchOperations';

export const SearchScreen: React.FC = () => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    handleClear
  } = useSearchOperations();
  const { handleResultPress } = useSearchNavigation();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <ImageBackground
        source={LayoutImages.background3}
        className="flex-1 w-full"
        resizeMode="cover"
        blurRadius={2.5}
      >
        <Box className="flex-1">
          <PageHeader
            title={i18n.t('common.search')}
            subtitle={i18n.t('search.searchTips')}
          />

          <SearchBar
            onSearch={handleSearch}
            onClear={handleClear}
            placeholder={i18n.t('search.placeholder')}
            value={searchQuery}
          />

          {isSearching ? (
            <Box className="flex-1 justify-center items-center">
              <Text className="text-base text-neutral-400">
                {i18n.t('search.searching')}
              </Text>
            </Box>
          ) : (
            <SearchResults
              results={searchResults}
              query={searchQuery}
              onResultPress={handleResultPress}
            />
          )}

          {searchQuery.length === 0 && <SearchTips />}
        </Box>
      </ImageBackground>
    </SafeAreaView>
  );
};
