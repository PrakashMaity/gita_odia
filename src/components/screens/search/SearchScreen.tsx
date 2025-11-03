import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { SearchBar, SearchResults } from './components';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useChapterStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { PageHeader } from '../shared/PageHeader';

interface SearchResult {
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  translation: string;
  speaker: string;
  matchType: 'sanskrit' | 'Language' | 'translation';
}

export const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { chapters } = useChapterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { incrementAction, showInterstitialIfReady } = useAdFrequency({
    interstitialInterval: 2,
  });

  const searchInChapters = (query: string): SearchResult[] => {
    if (!query.trim() || chapters.length === 0) {
      return [];
    }

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase().trim();

    chapters.forEach((chapterData) => {
      const { chapter, verses } = chapterData;
      
      verses?.forEach((verse: any) => {
        const matches: SearchResult[] = [];

        if (verse.sanskrit && verse.sanskrit.toLowerCase().includes(searchTerm)) {
          matches.push({
            chapterNumber: parseInt(chapter.number),
            verseNumber: verse.verseNumber,
            verseText: verse.sanskrit,
            translation: verse.translation,
            speaker: verse.speaker,
            matchType: 'sanskrit',
          });
        }

        if (verse.Language && verse.Language.toLowerCase().includes(searchTerm)) {
          matches.push({
            chapterNumber: parseInt(chapter.number),
            verseNumber: verse.verseNumber,
            verseText: verse.Language,
            translation: verse.translation,
            speaker: verse.speaker,
            matchType: 'Language',
          });
        }

        if (verse.translation && verse.translation.toLowerCase().includes(searchTerm)) {
          matches.push({
            chapterNumber: parseInt(chapter.number),
            verseNumber: verse.verseNumber,
            verseText: verse.translation,
            translation: verse.translation,
            speaker: verse.speaker,
            matchType: 'translation',
          });
        }

        results.push(...matches);
      });
    });

    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => 
        r.chapterNumber === result.chapterNumber && 
        r.verseNumber === result.verseNumber && 
        r.matchType === result.matchType
      )
    );

    return uniqueResults.sort((a, b) => {
      if (a.chapterNumber !== b.chapterNumber) {
        return a.chapterNumber - b.chapterNumber;
      }
      return a.verseNumber - b.verseNumber;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const results = searchInChapters(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleResultPress = (chapterNumber: number, verseNumber: number) => {
    incrementAction();
    router.push(`/chapter/${chapterNumber}?verse=${verseNumber}`);
    
    setTimeout(() => {
      showInterstitialIfReady();
    }, 500);
  };

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

        {searchQuery.length === 0 && (
          <ThemedView style={styles.tipsContainer}>
            <ThemedText style={{ ...styles.tipsTitle, color: theme.text.primary }}>
              {i18n.t('search.searchTips')}
            </ThemedText>
            <ThemedView style={styles.tipsList}>
              <ThemedView style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={theme.icon.success} />
                <ThemedText style={{ ...styles.tipText, color: theme.text.secondary }}>
                  {i18n.t('search.minCharacters')}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={theme.icon.success} />
                <ThemedText style={{ ...styles.tipText, color: theme.text.secondary }}>
                  {i18n.t('search.searchIn')}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={theme.icon.success} />
                <ThemedText style={{ ...styles.tipText, color: theme.text.secondary }}>
                  {i18n.t('search.tapToGo')}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  tipsContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.lg,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing.md,
  },
  tipsList: {
    gap: SIZES.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    marginLeft: SIZES.spacing.sm,
  },
});

