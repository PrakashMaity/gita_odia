import { useEffect } from 'react';
import { useChapterStore, useNotificationStore } from '@/store';
import { getRandomSloka } from '@/store/utils/notificationUtils';

/**
 * Custom hook for home screen initialization
 * Follows Single Responsibility Principle - handles app initialization logic
 */
export const useHomeInitialization = () => {
  const {
    shouldShowNewNotification,
    setDailySloka,
    setNotificationVisible,
  } = useNotificationStore();
  const { loadAllChapters } = useChapterStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadAllChapters();

      if (shouldShowNewNotification()) {
        const newSloka = getRandomSloka();
        setDailySloka(newSloka);
        setNotificationVisible(true);
      }
    };

    initializeApp();
  }, [loadAllChapters, shouldShowNewNotification, setDailySloka, setNotificationVisible]);
};

