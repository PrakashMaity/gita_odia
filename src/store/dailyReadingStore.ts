import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DailyReadingRecord {
  date: string; // YYYY-MM-DD format
  versesRead: number;
  chaptersRead: string[]; // chapter IDs
  readingTime: number; // in minutes
  timestamp: number;
}

interface DailyReadingState {
  records: DailyReadingRecord[];
  currentStreak: number;
  longestStreak: number;
  totalReadingDays: number;
  totalVersesRead: number;
  isLoading: boolean;
  isInitialized: boolean;
}

interface DailyReadingActions {
  loadDailyReading: () => Promise<void>;
  recordReading: (versesRead: number, chapterIds: string[], readingTime?: number) => Promise<void>;
  getTodayRecord: () => DailyReadingRecord | null;
  getStreak: () => number;
  getLongestStreak: () => number;
  getTotalReadingDays: () => number;
  getTotalVersesRead: () => number;
  getWeeklyStats: () => { date: string; versesRead: number }[];
  getMonthlyStats: () => { date: string; versesRead: number }[];
  resetAllData: () => Promise<void>;
}

interface DailyReadingStore extends DailyReadingState, DailyReadingActions {}

const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const calculateStreak = (records: DailyReadingRecord[]): number => {
  if (records.length === 0) return 0;

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Remove duplicates by date, keeping the most recent
  const uniqueRecords = sortedRecords.filter((record, index, self) =>
    index === self.findIndex(r => r.date === record.date)
  );

  if (uniqueRecords.length === 0) return 0;

  // Check if today or yesterday is in records
  const today = getTodayDate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const todayRecord = uniqueRecords.find(r => r.date === today);
  const yesterdayRecord = uniqueRecords.find(r => r.date === yesterdayStr);

  // If no reading today or yesterday, streak is broken
  if (!todayRecord && !yesterdayRecord) return 0;

  // Start counting from today or yesterday
  let streak = todayRecord ? 1 : 0;
  let currentDate = todayRecord ? new Date(today) : new Date(yesterday);

  // Count consecutive days
  for (let i = 0; i < uniqueRecords.length; i++) {
    const recordDate = new Date(uniqueRecords[i].date);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - 1);

    if (
      recordDate.getFullYear() === expectedDate.getFullYear() &&
      recordDate.getMonth() === expectedDate.getMonth() &&
      recordDate.getDate() === expectedDate.getDate()
    ) {
      streak++;
      currentDate = recordDate;
    } else if (i > 0) {
      // If there's a gap, break the streak
      break;
    }
  }

  return streak;
};

const calculateLongestStreak = (records: DailyReadingRecord[]): number => {
  if (records.length === 0) return 0;

  // Sort records by date
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Remove duplicates by date
  const uniqueDates = Array.from(
    new Set(sortedRecords.map(r => r.date))
  ).sort();

  if (uniqueDates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
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
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing item from secure storage:', error);
    }
  },
};

export const useDailyReadingStore = create<DailyReadingStore>()(
  persist(
    (set, get) => ({
      records: [],
      currentStreak: 0,
      longestStreak: 0,
      totalReadingDays: 0,
      totalVersesRead: 0,
      isLoading: false,
      isInitialized: false,

      loadDailyReading: async () => {
        const { isInitialized } = get();
        if (isInitialized) return;

        set({ isLoading: true });

        try {
          const recordsJson = await secureStorage.getItem('daily-reading-records');
          const records: DailyReadingRecord[] = recordsJson ? JSON.parse(recordsJson) : [];

          // Clean up old records (keep only last 365 days)
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          const filteredRecords = records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= oneYearAgo;
          });

          const currentStreak = calculateStreak(filteredRecords);
          const longestStreak = calculateLongestStreak(filteredRecords);
          const uniqueDates = new Set(filteredRecords.map(r => r.date));
          const totalVersesRead = filteredRecords.reduce((sum, r) => sum + r.versesRead, 0);

          set({
            records: filteredRecords,
            currentStreak,
            longestStreak,
            totalReadingDays: uniqueDates.size,
            totalVersesRead,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error('Error loading daily reading:', error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      recordReading: async (versesRead: number, chapterIds: string[], readingTime: number = 0) => {
        const { records } = get();
        const today = getTodayDate();
        const existingRecordIndex = records.findIndex(r => r.date === today);

        const newRecord: DailyReadingRecord = {
          date: today,
          versesRead: existingRecordIndex >= 0 
            ? records[existingRecordIndex].versesRead + versesRead 
            : versesRead,
          chaptersRead: existingRecordIndex >= 0
            ? Array.from(new Set([...records[existingRecordIndex].chaptersRead, ...chapterIds]))
            : chapterIds,
          readingTime: existingRecordIndex >= 0
            ? records[existingRecordIndex].readingTime + readingTime
            : readingTime,
          timestamp: Date.now(),
        };

        const updatedRecords = existingRecordIndex >= 0
          ? records.map((r, i) => i === existingRecordIndex ? newRecord : r)
          : [...records, newRecord];

        // Recalculate stats
        const currentStreak = calculateStreak(updatedRecords);
        const longestStreak = calculateLongestStreak(updatedRecords);
        const uniqueDates = new Set(updatedRecords.map(r => r.date));
        const totalVersesRead = updatedRecords.reduce((sum, r) => sum + r.versesRead, 0);

        try {
          await secureStorage.setItem('daily-reading-records', JSON.stringify(updatedRecords));
          set({
            records: updatedRecords,
            currentStreak,
            longestStreak,
            totalReadingDays: uniqueDates.size,
            totalVersesRead,
          });
        } catch (error) {
          console.error('Error saving daily reading:', error);
        }
      },

      getTodayRecord: () => {
        const { records } = get();
        const today = getTodayDate();
        return records.find(r => r.date === today) || null;
      },

      getStreak: () => {
        return get().currentStreak;
      },

      getLongestStreak: () => {
        return get().longestStreak;
      },

      getTotalReadingDays: () => {
        return get().totalReadingDays;
      },

      getTotalVersesRead: () => {
        return get().totalVersesRead;
      },

      getWeeklyStats: () => {
        const { records } = get();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyRecords = records.filter(r => {
          const recordDate = new Date(r.date);
          return recordDate >= weekAgo;
        });

        // Group by date and sum verses
        const statsMap = new Map<string, number>();
        weeklyRecords.forEach(r => {
          const current = statsMap.get(r.date) || 0;
          statsMap.set(r.date, current + r.versesRead);
        });

        return Array.from(statsMap.entries())
          .map(([date, versesRead]) => ({ date, versesRead }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },

      getMonthlyStats: () => {
        const { records } = get();
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        const monthlyRecords = records.filter(r => {
          const recordDate = new Date(r.date);
          return recordDate >= monthAgo;
        });

        // Group by date and sum verses
        const statsMap = new Map<string, number>();
        monthlyRecords.forEach(r => {
          const current = statsMap.get(r.date) || 0;
          statsMap.set(r.date, current + r.versesRead);
        });

        return Array.from(statsMap.entries())
          .map(([date, versesRead]) => ({ date, versesRead }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },

      resetAllData: async () => {
        try {
          await secureStorage.removeItem('daily-reading-records');
          set({
            records: [],
            currentStreak: 0,
            longestStreak: 0,
            totalReadingDays: 0,
            totalVersesRead: 0,
          });
        } catch (error) {
          console.error('Error resetting daily reading data:', error);
        }
      },
    }),
    {
      name: 'daily-reading-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

