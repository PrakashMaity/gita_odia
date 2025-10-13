import { rawChapters } from '@/Data';
import { ChapterData, ChapterStore } from '@/interface/chapter.interface';
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
export const useChapterStore = create<ChapterStore>()((set, get) => ({
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
    const { chapters } = get();
    return chapters.find((ch) => ch.chapter.id === chapterId) || null;
  },

  getChapterByNumber: (chapterNumber: number) => {
    const { chapters } = get();
    return (
      chapters.find(
        (ch) => parseInt(ch.chapter.number, 10) === chapterNumber
      ) || null
    );
  },

  getAllChapters: () => get().chapters,

  getChapterWithProgress: (chapterId: string, progressStore: any) => {
    const { chapters } = get();
    const chapter = chapters.find((ch) => ch.chapter.id === chapterId);
    if (!chapter) return null;

    const chapterNumber = parseInt(chapter.chapter.number, 10);
    const progress = progressStore.getProgress(chapterNumber);

    return { ...chapter, progress };
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      chapters: [],
      isLoading: false,
      isInitialized: false,
      error: null,
    }),
}));
