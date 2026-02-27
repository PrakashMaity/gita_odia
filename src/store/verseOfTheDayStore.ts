import i18n from '@/lib/i18n';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { useChapterStore } from './chapterStore';

export interface VerseOfTheDay {
  date: string; // YYYY-MM-DD format
  chapterId: string;
  chapterNumber: string;
  verseId: string;
  verseNumber: string;
  verseText: string;
  translation: string;
  timestamp: number;
}

interface VerseOfTheDayState {
  currentVerse: VerseOfTheDay | null;
  isLoading: boolean;
}

interface VerseOfTheDayActions {
  loadVerseOfTheDay: () => Promise<void>;
  getTodaysVerse: () => VerseOfTheDay | null;
  shareVerse: () => string | null;
}

interface VerseOfTheDayStore extends VerseOfTheDayState, VerseOfTheDayActions { }

const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Generate a deterministic verse based on the date
const generateVerseForDate = async (date: string): Promise<VerseOfTheDay | null> => {
  try {
    const chapterStore = useChapterStore.getState();

    // Ensure chapters are loaded
    if (!chapterStore.isInitialized) {
      await chapterStore.loadAllChapters();
    }

    const chapters = chapterStore.getAllChapters();

    if (chapters.length === 0) return null;

    // Use date as seed for deterministic selection
    const dateNum = parseInt(date.replace(/-/g, ''), 10);
    const seed = dateNum % 10000; // Use last 4 digits for seed

    // Select chapter based on seed
    const chapterIndex = seed % chapters.length;
    const selectedChapter = chapters[chapterIndex];

    if (!selectedChapter || !selectedChapter.verses || selectedChapter.verses.length === 0) {
      return null;
    }

    // Select verse based on seed
    const verseIndex = (seed * 7) % selectedChapter.verses.length;
    const selectedVerse = selectedChapter.verses[verseIndex];

    return {
      date,
      chapterId: selectedChapter.chapter.id,
      chapterNumber: selectedChapter.chapter.number,
      verseId: selectedVerse.id,
      verseNumber: selectedVerse.verseNumber,
      verseText: selectedVerse.Language || selectedVerse.verseText || '',
      translation: selectedVerse.translation || '',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error generating verse of the day:', error);
    return null;
  }
};

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error setting item in secure storage:', error);
    }
  },
};

export const useVerseOfTheDayStore = create<VerseOfTheDayStore>()((set, get) => ({
  currentVerse: null,
  isLoading: false,

  loadVerseOfTheDay: async () => {
    set({ isLoading: true });

    try {
      const today = getTodayDate();

      // Check if we have a cached verse for today
      const cachedJson = await secureStorage.getItem('verse-of-the-day');
      if (cachedJson) {
        const cached: VerseOfTheDay = JSON.parse(cachedJson);
        if (cached.date === today) {
          set({ currentVerse: cached, isLoading: false });
          return;
        }
      }

      // Generate new verse for today
      const newVerse = await generateVerseForDate(today);

      if (newVerse) {
        await secureStorage.setItem('verse-of-the-day', JSON.stringify(newVerse));
        set({ currentVerse: newVerse, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading verse of the day:', error);
      set({ isLoading: false });
    }
  },

  getTodaysVerse: () => {
    return get().currentVerse;
  },

  shareVerse: () => {
    const verse = get().currentVerse;
    if (!verse) return null;

    return `📖 ${verse.chapterNumber} ${i18n.t('share.chapter')}, ${verse.verseNumber} ${i18n.t('share.verse')}\n\n${verse.verseText}\n\n${verse.translation}\n\n- ${i18n.t('share.appTitle')}`;
  },
}));

