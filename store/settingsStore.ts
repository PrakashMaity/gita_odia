import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Settings {
  themeMode: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  autoPlayNext: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: 'Language' | 'english' | 'hindi';
  onboardingCompleted: boolean;
}

interface SettingsStore {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
  resetOnboarding: () => void;
  toggleNotifications: () => void;
  toggleAutoPlayNext: () => void;
}

const defaultSettings: Settings = {
  themeMode: 'system',
  notificationsEnabled: true,
  autoPlayNext: false,
  fontSize: 'medium',
  language: 'Language',
  onboardingCompleted: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      updateSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: value,
          },
        })),
      
      resetSettings: () =>
        set(() => ({
          settings: defaultSettings,
        })),
      
      resetOnboarding: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            onboardingCompleted: false,
          },
        })),
      
      toggleNotifications: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            notificationsEnabled: !state.settings.notificationsEnabled,
          },
        })),
      
      toggleAutoPlayNext: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            autoPlayNext: !state.settings.autoPlayNext,
          },
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
