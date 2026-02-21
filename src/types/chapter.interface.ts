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
  
 export interface ChapterState {
    chapters: ChapterData[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
  }
  
 export interface ChapterActions {
    loadAllChapters: () => Promise<void>;
    getChapterById: (chapterId: string) => ChapterData | null;
    getChapterByNumber: (chapterNumber: number) => ChapterData | null;
    getAllChapters: () => ChapterData[];
    getChapterWithProgress: (
      chapterId: string,
      progressStore: any
    ) => (ChapterData & { progress?: any }) | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  }
  
  export interface ChapterStore extends ChapterState, ChapterActions {}