import { create } from 'zustand';

export interface ChapterData {
  chapter: {
    number: string;
    title: string;
    subtitle: string;
    englishTitle: string;
    totalVerses: string;
    description: string;
    id: string;
    verseNumber?: string;
  };
  verses?: any[];
  summary?: {
    title: string;
    description: string;
    keyThemes: string[];
  };
  dedication?: any;
}

interface ChapterState {
  chapters: ChapterData[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface ChapterActions {
  loadAllChapters: () => Promise<void>;
  getChapterById: (chapterId: string) => ChapterData | null;
  getChapterByNumber: (chapterNumber: number) => ChapterData | null;
  getAllChapters: () => ChapterData[];
  getChapterWithProgress: (chapterId: string, progressStore: any) => (ChapterData & { progress?: any }) | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

interface ChapterStore extends ChapterState, ChapterActions {}

// Normalize chapter data function (centralized)
const normalizeChapterData = (rawData: any): ChapterData => {
  if (rawData.chapter) {
    return rawData as ChapterData;
  } else {
    const summaryText = typeof rawData.summary === 'string' ? rawData.summary : rawData.summary?.description || '';
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
  }
};

export const useChapterStore = create<ChapterStore>()((set, get) => ({
  // Initial state
  chapters: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  // Actions
  loadAllChapters: async () => {
    const { isInitialized } = get();
    
    // If already loaded, don't reload
    if (isInitialized) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const chapterPromises = [
        import('@/Data/chapter1.json').then(module => module.default),
        import('@/Data/chapter2.json').then(module => module.default),
        import('@/Data/chapter3.json').then(module => module.default),
        import('@/Data/chapter4.json').then(module => module.default),
        import('@/Data/chapter5.json').then(module => module.default),
        import('@/Data/chapter6.json').then(module => module.default),
        import('@/Data/chapter7.json').then(module => module.default),
        import('@/Data/chapter8.json').then(module => module.default),
        import('@/Data/chapter9.json').then(module => module.default),
        import('@/Data/chapter10.json').then(module => module.default),
        import('@/Data/chapter11.json').then(module => module.default),
        import('@/Data/chapter12.json').then(module => module.default),
        import('@/Data/chapter13.json').then(module => module.default),
        import('@/Data/chapter14.json').then(module => module.default),
        import('@/Data/chapter15.json').then(module => module.default),
        import('@/Data/chapter16.json').then(module => module.default),
        import('@/Data/chapter17.json').then(module => module.default),
        import('@/Data/chapter18.json').then(module => module.default),
      ];

      const rawChapterData = await Promise.all(chapterPromises);
      const normalizedData = rawChapterData.map(normalizeChapterData);

      set({ 
        chapters: normalizedData,
        isLoading: false,
        isInitialized: true,
        error: null
      });
    } catch (error) {
      console.error('Error loading chapters:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load chapters'
      });
    }
  },

  getChapterById: (chapterId: string) => {
    const { chapters } = get();
    return chapters.find(chapter => chapter.chapter.id === chapterId) || null;
  },

  getChapterByNumber: (chapterNumber: number) => {
    const { chapters } = get();
    return chapters.find(chapter => parseInt(chapter.chapter.number) === chapterNumber) || null;
  },

  getAllChapters: () => {
    const { chapters } = get();
    return chapters;
  },

  getChapterWithProgress: (chapterId: string, progressStore: any) => {
    const { chapters } = get();
    const chapter = chapters.find(chapter => chapter.chapter.id === chapterId);
    if (!chapter) return null;
    
    const chapterNumber = parseInt(chapter.chapter.number);
    const progress = progressStore.getProgress(chapterNumber);
    
    return {
      ...chapter,
      progress
    };
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  reset: () => {
    set({
      chapters: [],
      isLoading: false,
      isInitialized: false,
      error: null
    });
  },
}));
