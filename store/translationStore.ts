import { rawChapters } from '@/Data';
import { create } from 'zustand';

export interface TranslationData {
  chapter: {
    number: string;
    title: string;
    subtitle: string;
    englishTitle: string;
    totalVerses: string;
    description: string;
    id: string;
  };
  verses?: {
    verseNumber: string;
    translation: string;
    speaker: string;
    id: string;
  }[];
  summary?: {
    title: string;
    description: string;
    keyThemes: string[];
  };
}

interface TranslationState {
  translations: TranslationData[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface TranslationActions {
  loadAllTranslations: () => Promise<void>;
  getTranslationById: (chapterId: string) => TranslationData | null;
  getTranslationByNumber: (chapterNumber: number) => TranslationData | null;
  getAllTranslations: () => TranslationData[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

interface TranslationStore extends TranslationState, TranslationActions { }

// Normalize translation data function
const normalizeTranslationData = (rawData: any): TranslationData => {
  if (rawData.chapter) {
    // Extract only translation data from verses
    const translationVerses = rawData.verses?.map((verse: any) => ({
      verseNumber: verse.verseNumber,
      translation: verse.translation,
      speaker: verse.speaker,
      id: verse.id,
    })) || [];

    return {
      chapter: {
        number: rawData.chapter.number,
        title: rawData.chapter.title,
        subtitle: rawData.chapter.subtitle,
        englishTitle: rawData.chapter.englishTitle,
        totalVerses: rawData.chapter.totalVerses,
        description: rawData.chapter.description,
        id: rawData.chapter.id,
      },
      verses: translationVerses,
      summary: rawData.summary,
    };
  } else {
    return {
      chapter: {
        number: rawData.chapterNumber || '0',
        title: rawData.title || '',
        subtitle: rawData.title || '',
        englishTitle: rawData.titleEnglish || '',
        totalVerses: rawData.totalVerses || '0',
        description: rawData.description || '',
        id: rawData.id || '',
      },
      verses: [],
      summary: {
        title: rawData.title || '',
        description: rawData.description || '',
        keyThemes: rawData.keyThemes || [],
      },
    };
  }
};

export const useTranslationStore = create<TranslationStore>()((set, get) => ({
  // Initial state
  translations: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  // Actions
  loadAllTranslations: async () => {
    const { isInitialized } = get();

    // If already loaded, don't reload
    if (isInitialized) {
      return;
    }

    set({ isLoading: true, error: null });

    try {

      const normalizedData = rawChapters.map(normalizeTranslationData);

      set({
        translations: normalizedData,
        isLoading: false,
        isInitialized: true,
        error: null
      });
    } catch (error) {
      console.error('Error loading translations:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load translations'
      });
    }
  },

  getTranslationById: (chapterId: string) => {
    const { translations } = get();
    return translations.find(translation => translation.chapter.id === chapterId) || null;
  },

  getTranslationByNumber: (chapterNumber: number) => {
    const { translations } = get();
    return translations.find(translation => parseInt(translation.chapter.number) === chapterNumber) || null;
  },

  getAllTranslations: () => {
    const { translations } = get();
    return translations;
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  reset: () => {
    set({
      translations: [],
      isLoading: false,
      isInitialized: false,
      error: null
    });
  },
}));
