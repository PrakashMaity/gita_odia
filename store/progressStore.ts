import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export interface ReadingProgress {
  chapterId: string;
  lastReadVerseId: string;
  totalVerses: number;
  lastReadDate: number;
  isCompleted: boolean;
}

interface ProgressState {
  progress: { [chapterId: string]: ReadingProgress };
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface ProgressActions {
  loadProgress: () => Promise<void>;
  updateProgress: (chapterId: string, currentVerseId: string, totalVerses: number) => Promise<void>;
  markChapterCompleted: (chapterId: string) => Promise<void>;
  getProgress: (chapterId: string) => ReadingProgress | null;
  getAllProgress: () => { [chapterId: string]: ReadingProgress };
  resetChapterProgress: (chapterId: string) => Promise<void>;
  resetAllProgress: () => Promise<void>;
  getProgressPercentage: (chapterId: string, currentVerseIndex: number, totalVerses: number) => number;
  isChapterCompleted: (chapterId: string) => boolean;
  getTotalProgress: () => { completed: number; total: number; percentage: number };
  getLastReadVerseId: (chapterId: string) => string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface ProgressStore extends ProgressState, ProgressActions {}

const PROGRESS_KEY = 'gita_reading_progress';

export const useProgressStore = create<ProgressStore>()((set, get) => ({
  // Initial state
  progress: {},
  isLoading: false,
  isInitialized: false,
  error: null,

  // Actions
  loadProgress: async () => {
    const { isInitialized } = get();
    
    if (isInitialized) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const progressJson = await SecureStore.getItemAsync(PROGRESS_KEY);
      const progress = progressJson ? JSON.parse(progressJson) : {};
      
      set({ 
        progress,
        isLoading: false,
        isInitialized: true,
        error: null
      });
    } catch (error) {
      console.error('Error loading reading progress:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load progress'
      });
    }
  },

  updateProgress: async (chapterId: string, currentVerseId: string, totalVerses: number) => {
    const { progress } = get();
    
    // Find the verse index to determine if chapter is completed
    // This will be handled by the calling component
    const isCompleted = false;
    const newProgress: ReadingProgress = {
      chapterId,
      lastReadVerseId: currentVerseId,
      totalVerses,
      lastReadDate: Date.now(),
      isCompleted,
    };

    const updatedProgress = {
      ...progress,
      [chapterId]: newProgress
    };

    try {
      await SecureStore.setItemAsync(PROGRESS_KEY, JSON.stringify(updatedProgress));
      set({ progress: updatedProgress });
    } catch (error) {
      console.error('Error saving reading progress:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to save progress' });
    }
  },

  markChapterCompleted: async (chapterId: string) => {
    const { progress } = get();
    const chapterProgress = progress[chapterId];
    if (chapterProgress) {
      const updatedProgress = {
        ...progress,
        [chapterId]: {
          ...chapterProgress,
          isCompleted: true
        }
      };

      try {
        await SecureStore.setItemAsync(PROGRESS_KEY, JSON.stringify(updatedProgress));
        set({ progress: updatedProgress });
      } catch (error) {
        console.error('Error marking chapter as completed:', error);
        set({ error: error instanceof Error ? error.message : 'Failed to mark chapter as completed' });
      }
    }
  },

  getProgress: (chapterId: string) => {
    const { progress } = get();
    return progress[chapterId] || null;
  },

  getAllProgress: () => {
    const { progress } = get();
    return progress;
  },

  resetChapterProgress: async (chapterId: string) => {
    const { progress } = get();
    const updatedProgress = { ...progress };
    delete updatedProgress[chapterId];

    try {
      await SecureStore.setItemAsync(PROGRESS_KEY, JSON.stringify(updatedProgress));
      set({ progress: updatedProgress });
    } catch (error) {
      console.error('Error resetting chapter progress:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to reset progress' });
    }
  },

  resetAllProgress: async () => {
    try {
      await SecureStore.deleteItemAsync(PROGRESS_KEY);
      set({ progress: {} });
    } catch (error) {
      console.error('Error resetting all progress:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to reset all progress' });
    }
  },

  getProgressPercentage: (chapterId: string, currentVerseIndex: number, totalVerses: number) => {
    const { progress } = get();
    const chapterProgress = progress[chapterId];
    if (!chapterProgress) return 0;
    
    // Calculate percentage based on current verse index
    const percentage = Math.round(((currentVerseIndex + 1) / totalVerses) * 100);
    return Math.min(percentage, 100); // Cap at 100%
  },

  isChapterCompleted: (chapterId: string) => {
    const { progress } = get();
    const chapterProgress = progress[chapterId];
    return chapterProgress?.isCompleted || false;
  },

  getTotalProgress: () => {
    const { progress } = get();
    const chapters = Object.values(progress);
    const completed = chapters.filter(chapter => chapter.isCompleted).length;
    const total = chapters.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  },

  getLastReadVerseId: (chapterId: string) => {
    const { progress } = get();
    const chapterProgress = progress[chapterId];
    return chapterProgress?.lastReadVerseId || null;
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));