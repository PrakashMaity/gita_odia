import { MenuItem } from '@/constants/menuData';
import { router } from 'expo-router';

// Navigation handlers for different menu items
export const navigationHandlers = {
  // Prayer and Stotra handlers
  mangalacharan: () => {
    router.push('/mangalacharan');
  },
  
  dhyana: () => {
    router.push('/dhyana');
  },
  
  'mala-japa': () => {
    router.push('/mala-japa');
  },
  
  stotra: () => {
    // Add navigation logic here
  },
  
  // Chapter handlers
  allChapters: () => {
    router.push('/(tabs)/chapters');
  },
  
  // Translation handlers
  allTranslations: () => {
    router.push('/translations');
  },
  
  chapterList: () => {
    // Add navigation logic here
  },
  
  randomChapter: () => {
    // Add navigation logic here
  },
  
  // Feature handlers
  bookmarks: () => {
    router.push('/(tabs)/bookmarks');
  },
  
  favorites: () => {
    router.push('/favorites');
  },
  
  notes: () => {
    // Add navigation logic here
  },
  
  search: () => {
    // Add navigation logic here
  },
  
  // Study handlers
  'daily-reading': () => {
    router.push('/daily-reading');
  },
  
  'verse-of-the-day': () => {
    router.push('/verse-of-the-day');
  },
  
  'reading-timer': () => {
    router.push('/reading-timer');
  },
  
  progress: () => {
    // Add navigation logic here
  },
  
  quiz: () => {
    // Add navigation logic here
  },
  
  // Settings handlers
  fontSettings: () => {
    // Add navigation logic here
  },
  
  
  help: () => {
    // Add navigation logic here
  },
  
  about: () => {
    // Add navigation logic here
  },
  
  // New handlers for home page buttons
  gitaSummary: () => {
    router.push('/gita-summary');
  },
  
  gitaMahatmya: () => {
    router.push('/gita-mahatmya');
  },
  
  'all-ekadashi': () => {
    router.push('/all-ekadashi');
  },
};

// Helper function to get the appropriate handler for a menu item
export const getNavigationHandler = (item: MenuItem) => {
  const handlerMap: Record<string, () => void> = {
    'mangalacharan': navigationHandlers.mangalacharan,
    'dhyana': navigationHandlers.dhyana,
    'mala-japa': navigationHandlers['mala-japa'],
    'stotra': navigationHandlers.stotra,
    'all-chapters': navigationHandlers.allChapters,
    'all-translations': navigationHandlers.allTranslations,
    'chapter-list': navigationHandlers.chapterList,
    'random-chapter': navigationHandlers.randomChapter,
    'bookmarks': navigationHandlers.bookmarks,
    'favorites': navigationHandlers.favorites,
    'notes': navigationHandlers.notes,
    'search': navigationHandlers.search,
    'daily-reading': navigationHandlers['daily-reading'],
    'verse-of-the-day': navigationHandlers['verse-of-the-day'],
    'reading-timer': navigationHandlers['reading-timer'],
    'progress': navigationHandlers.progress,
    'quiz': navigationHandlers.quiz,
    'font-settings': navigationHandlers.fontSettings,
    'help': navigationHandlers.help,
    'about': navigationHandlers.about,
    'gita-summary': navigationHandlers.gitaSummary,
    'gita-mahatmya': navigationHandlers.gitaMahatmya,
    'all-ekadashi': navigationHandlers['all-ekadashi'],
  };
  
  return handlerMap[item.id] || (() => {});
};
