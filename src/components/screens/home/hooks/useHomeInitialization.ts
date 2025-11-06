import { useEffect } from 'react';
import { useChapterStore } from '@/store';

/**
 * Custom hook for home screen initialization
 * Follows Single Responsibility Principle - handles app initialization logic
 */
export const useHomeInitialization = () => {
  const { loadAllChapters } = useChapterStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadAllChapters();
    };

    initializeApp();
  }, [loadAllChapters]);
};

