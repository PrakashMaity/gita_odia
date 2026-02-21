import { SearchResult } from '@/types/screen.interface';
import { useChapterStore } from '@/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Custom hook for search operations
 * Follows Single Responsibility Principle - handles search logic and results
 * Optimized with proper debouncing and memoization
 */
export const useSearchOperations = () => {
  const { chapters } = useChapterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize search function to avoid recreating on every render
  const searchInChapters = useCallback((query: string): SearchResult[] => {
    if (!query.trim() || chapters.length === 0) {
      return [];
    }

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase().trim();

    // Early exit if search term is too short
    if (searchTerm.length < 2) {
      return [];
    }

    // Use for loop for better performance than forEach
    for (let i = 0; i < chapters.length; i++) {
      const chapterData = chapters[i];
      const { chapter, verses } = chapterData;
      
      if (!verses || verses.length === 0) continue;
      
      for (let j = 0; j < verses.length; j++) {
        const verse = verses[j];
        const matches: SearchResult[] = [];

        // Check sanskrit
        if (verse.sanskrit?.toLowerCase().includes(searchTerm)) {
          matches.push({
            chapterNumber: parseInt(chapter.number, 10),
            verseNumber: verse.verseNumber,
            verseText: verse.sanskrit,
            translation: verse.translation,
            speaker: verse.speaker,
            matchType: 'sanskrit',
          });
        }

        // Check Language
        if (verse.Language?.toLowerCase().includes(searchTerm)) {
          matches.push({
            chapterNumber: parseInt(chapter.number, 10),
            verseNumber: verse.verseNumber,
            verseText: verse.Language,
            translation: verse.translation,
            speaker: verse.speaker,
            matchType: 'Language',
          });
        }

        // Check translation
        if (verse.translation?.toLowerCase().includes(searchTerm)) {
          matches.push({
            chapterNumber: parseInt(chapter.number, 10),
            verseNumber: verse.verseNumber,
            verseText: verse.translation,
            translation: verse.translation,
            speaker: verse.speaker,
            matchType: 'translation',
          });
        }

        if (matches.length > 0) {
          results.push(...matches);
        }
      }
    }

    // Use Map for O(1) lookup instead of O(n) findIndex
    const uniqueMap = new Map<string, SearchResult>();
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const key = `${result.chapterNumber}-${result.verseNumber}-${result.matchType}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, result);
      }
    }

    const uniqueResults = Array.from(uniqueMap.values());

    // Sort results
    return uniqueResults.sort((a, b) => {
      if (a.chapterNumber !== b.chapterNumber) {
        return a.chapterNumber - b.chapterNumber;
      }
      return a.verseNumber - b.verseNumber;
    });
  }, [chapters]);

  // Proper debouncing with cleanup
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Debounce search execution
    debounceTimerRef.current = setTimeout(() => {
      const results = searchInChapters(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, [searchInChapters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClear = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    handleClear,
  };
};

