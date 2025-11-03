import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface DailySloka {
  id: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  Language: string;
  translation: string;
  speaker: string;
  date: string; // YYYY-MM-DD format
}

interface NotificationStore {
  dailySloka: DailySloka | null;
  lastNotificationDate: string | null;
  isNotificationVisible: boolean;
  setDailySloka: (sloka: DailySloka) => void;
  setNotificationVisible: (visible: boolean) => void;
  shouldShowNewNotification: () => boolean;
  hasNotification: () => boolean;
  clearDailySloka: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      dailySloka: null,
      lastNotificationDate: null,
      isNotificationVisible: false,
      
      setDailySloka: (sloka) =>
        set(() => ({
          dailySloka: sloka,
          lastNotificationDate: sloka.date,
          isNotificationVisible: true,
        })),
      
      setNotificationVisible: (visible) =>
        set(() => ({
          isNotificationVisible: visible,
        })),
      
      shouldShowNewNotification: () => {
        const { lastNotificationDate } = get();
        const today = new Date().toISOString().split('T')[0];
        
        if (!lastNotificationDate) {
          return true;
        }
        
        return lastNotificationDate !== today;
      },
      
      hasNotification: () => {
        const { dailySloka } = get();
        return dailySloka !== null;
      },
      
      clearDailySloka: () =>
        set(() => ({
          dailySloka: null,
          lastNotificationDate: null,
          isNotificationVisible: false,
        })),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
