import { rawChapters } from '@/assets/Data';
import { ChapterData, ChapterStore } from '@/types/chapter.interface';
import { create } from 'zustand';
// --- TYPES ---


// --- HELPERS ---
const normalizeChapterData = (rawData: any): ChapterData => {
  if (rawData.chapter) return rawData as ChapterData;

  const summaryText =
    typeof rawData.summary === 'string'
      ? rawData.summary
      : rawData.summary?.description || '';

  return {
    chapter: {
      number: rawData.chapterNumber || '0',
      title: rawData.title || '',
      subtitle: rawData.title || '',
      englishTitle: rawData.titleEnglish || '',
      totalVerses: rawData.totalVerses || '0',
      description: summaryText,
      id: rawData.id || '',
    },
    verses: rawData.verses || [],
    summary: {
      title: rawData.title || '',
      description: summaryText,
      keyThemes: rawData.keyThemes || [],
    },
    dedication: rawData.dedication,
  };
};


// --- MAIN STORE ---
export const useChapterStore = create<ChapterStore>()((set, get) => {
  // Internal cache for O(1) lookups
  let chaptersByIdMap = new Map<string, ChapterData>();
  let chaptersByNumberMap = new Map<number, ChapterData>();

  const buildLookupMaps = (chapters: ChapterData[]) => {
    chaptersByIdMap.clear();
    chaptersByNumberMap.clear();
    
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      chaptersByIdMap.set(chapter.chapter.id, chapter);
      const chapterNumber = parseInt(chapter.chapter.number, 10);
      if (!isNaN(chapterNumber)) {
        chaptersByNumberMap.set(chapterNumber, chapter);
      }
    }
  };

  return {
    chapters: [],
    isLoading: false,
    isInitialized: false,
    error: null,

    loadAllChapters: async () => {
      const { isInitialized } = get();
      if (isInitialized) return;

      set({ isLoading: true, error: null });

      try {
        const normalizedData = rawChapters.map(normalizeChapterData);
        
        // Build lookup maps for O(1) access
        buildLookupMaps(normalizedData);

        set({
          chapters: normalizedData,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (error) {
        console.error('❌ Error loading chapters:', error);
        set({
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Failed to load chapters',
        });
      }
    },

    getChapterById: (chapterId: string) => {
      // Use Map for O(1) lookup instead of O(n) find
      return chaptersByIdMap.get(chapterId) || null;
    },

    getChapterByNumber: (chapterNumber: number) => {
      // Use Map for O(1) lookup instead of O(n) find
      return chaptersByNumberMap.get(chapterNumber) || null;
    },

    getAllChapters: () => get().chapters,

    getChapterWithProgress: (chapterId: string, progressStore: any) => {
      const chapter = chaptersByIdMap.get(chapterId);
      if (!chapter) return null;

      const chapterNumber = parseInt(chapter.chapter.number, 10);
      const progress = progressStore.getProgress(chapterNumber);

      return { ...chapter, progress };
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    reset: () => {
      chaptersByIdMap.clear();
      chaptersByNumberMap.clear();
      set({
        chapters: [],
        isLoading: false,
        isInitialized: false,
        error: null,
      });
    },
  };
});
