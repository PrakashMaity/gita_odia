import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SearchBar, SearchResults, SearchTips } from './components';
import { useSearchNavigation } from './hooks/useSearchNavigation';
import { useSearchOperations } from './hooks/useSearchOperations';
import { PageHeader } from '@/components/shared';
import { styles } from './SearchScreen.styles';

export const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    handleSearch, 
    handleClear 
  } = useSearchOperations();
  const { handleResultPress } = useSearchNavigation();

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.container}>
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
          <ThemedView style={styles.loadingContainer}>
            <ThemedText style={{ ...styles.loadingText, color: theme.text.secondary }}>
              {i18n.t('search.searching')}
            </ThemedText>
          </ThemedView>
        ) : (
          <SearchResults
            results={searchResults}
            query={searchQuery}
            onResultPress={handleResultPress}
          />
        )}

        {searchQuery.length === 0 && <SearchTips />}
      </ThemedView>
    </ThemedSafeAreaView>
  );
};


