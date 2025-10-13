import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Bookmark {
  id: string;
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  timestamp: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
}

interface BookmarkActions {
  addBookmark: (verseId: string, chapterId: string, chapterNumber: string, verseNumber: string, verseText: string) => Promise<void>;
  removeBookmark: (verseId: string) => Promise<void>;
  isBookmarked: (verseId: string) => boolean;
  getBookmarksByChapter: (chapterId: string) => Bookmark[];
  clearAllBookmarks: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  getBookmarkCount: () => number;
  getBookmarksSortedByDate: () => Bookmark[];
}

interface BookmarkStore extends BookmarkState, BookmarkActions {}

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

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      // Initial state
      bookmarks: [],
      isLoading: false,

      // Actions
      addBookmark: async (verseId: string, chapterId: string, chapterNumber: string, verseNumber: string, verseText: string) => {
        set({ isLoading: true });
        
        const { bookmarks } = get();
        const bookmarkId = `${chapterNumber}-${verseNumber}`;
        
        // Check if bookmark already exists
        const existingBookmark = bookmarks.find(
          (bookmark) => bookmark.verseId === verseId
        );
        
        if (existingBookmark) {
          set({ isLoading: false });
          return;
        }
        
        const newBookmark: Bookmark = {
          id: bookmarkId,
          verseId,
          chapterId,
          chapterNumber,
          verseNumber,
          verseText,
          timestamp: Date.now(),
        };
        
        set({ 
          bookmarks: [...bookmarks, newBookmark],
          isLoading: false 
        });
      },

      removeBookmark: async (verseId: string) => {
        set({ isLoading: true });
        
        const { bookmarks } = get();
        const updatedBookmarks = bookmarks.filter(
          (bookmark) => bookmark.verseId !== verseId
        );
        
        set({ 
          bookmarks: updatedBookmarks,
          isLoading: false 
        });
      },

      isBookmarked: (verseId: string) => {
        const { bookmarks } = get();
        return bookmarks.some(
          (bookmark) => bookmark.verseId === verseId
        );
      },

      getBookmarksByChapter: (chapterId: string) => {
        const { bookmarks } = get();
        return bookmarks
          .filter((bookmark) => bookmark.chapterId === chapterId)
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

      clearAllBookmarks: async () => {
        set({ isLoading: true });
        set({ 
          bookmarks: [],
          isLoading: false 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Utility function to get bookmark count
      getBookmarkCount: () => {
        const { bookmarks } = get();
        return bookmarks.length;
      },

      // Utility function to get bookmarks sorted by timestamp (newest first)
      getBookmarksSortedByDate: () => {
        const { bookmarks } = get();
        return [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
      },
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        bookmarks: state.bookmarks,
      }),
    }
  )
);
