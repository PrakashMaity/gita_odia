import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface FavoriteVerse {
  id: string;
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  timestamp: number;
}

interface FavoriteState {
  favorites: FavoriteVerse[];
  isLoading: boolean;
}

interface FavoriteActions {
  addFavorite: (verseId: string, chapterId: string, chapterNumber: string, verseNumber: string, verseText: string) => Promise<void>;
  removeFavorite: (verseId: string) => Promise<void>;
  isFavorite: (verseId: string) => boolean;
  getFavoritesByChapter: (chapterId: string) => FavoriteVerse[];
  clearAllFavorites: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  getFavoriteCount: () => number;
  getFavoritesSortedByDate: () => FavoriteVerse[];
}

interface FavoriteStore extends FavoriteState, FavoriteActions {}

// Custom storage adapter for Zustand persistence
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
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing item from secure storage:', error);
    }
  },
};

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      isLoading: false,

      // Actions
      addFavorite: async (verseId: string, chapterId: string, chapterNumber: string, verseNumber: string, verseText: string) => {
        set({ isLoading: true });
        
        const { favorites } = get();
        const favoriteId = `${chapterNumber}-${verseNumber}`;
        
        // Check if favorite already exists
        const existingFavorite = favorites.find(
          (favorite) => favorite.verseId === verseId
        );
        
        if (existingFavorite) {
          set({ isLoading: false });
          return;
        }
        
        const newFavorite: FavoriteVerse = {
          id: favoriteId,
          verseId,
          chapterId,
          chapterNumber,
          verseNumber,
          verseText,
          timestamp: Date.now(),
        };
        
        set({ 
          favorites: [...favorites, newFavorite],
          isLoading: false 
        });
      },

      removeFavorite: async (verseId: string) => {
        set({ isLoading: true });
        
        const { favorites } = get();
        const updatedFavorites = favorites.filter(
          (favorite) => favorite.verseId !== verseId
        );
        
        set({ 
          favorites: updatedFavorites,
          isLoading: false 
        });
      },

      isFavorite: (verseId: string) => {
        const { favorites } = get();
        return favorites.some(
          (favorite) => favorite.verseId === verseId
        );
      },

      getFavoritesByChapter: (chapterId: string) => {
        const { favorites } = get();
        return favorites
          .filter((favorite) => favorite.chapterId === chapterId)
          .sort((a, b) => {
            // Convert Language numerals to numbers for sorting
            const aNum = parseInt(a.verseNumber.replace(/[০-৯]/g, (match) => 
              String.fromCharCode(match.charCodeAt(0) - '০'.charCodeAt(0) + '0'.charCodeAt(0))
            ));
            const bNum = parseInt(b.verseNumber.replace(/[০-৯]/g, (match) => 
              String.fromCharCode(match.charCodeAt(0) - '০'.charCodeAt(0) + '0'.charCodeAt(0))
            ));
            return aNum - bNum;
          });
      },

      clearAllFavorites: async () => {
        set({ isLoading: true });
        set({ 
          favorites: [],
          isLoading: false 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Utility function to get favorite count
      getFavoriteCount: () => {
        const { favorites } = get();
        return favorites.length;
      },

      // Utility function to get favorites sorted by timestamp (newest first)
      getFavoritesSortedByDate: () => {
        const { favorites } = get();
        return [...favorites].sort((a, b) => b.timestamp - a.timestamp);
      },
    }),
    {
      name: 'favorite-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
