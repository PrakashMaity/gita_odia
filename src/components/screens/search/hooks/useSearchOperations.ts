import { SearchResult } from '@/interface/screen.interface';
import { useChapterStore } from '@/store';
import { useCallback, useState } from 'react';

/**
 * Custom hook for search operations
 * Follows Single Responsibility Principle - handles search logic and results
 */
export const useSearchOperations = () => {
  const { chapters } = useChapterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInChapters = useCallback((query: string): SearchResult[] => {
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
  }, [chapters]);

  const handleSearch = useCallback((query: string) => {
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
  }, [searchInChapters]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    handleClear,
  };
};

