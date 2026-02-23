import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Settings {
  notificationsEnabled: boolean;
  autoPlayNext: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: 'Language' | 'english';
  onboardingCompleted: boolean;
  developerMode: boolean; // Developer mode toggle for ads
}

interface SettingsStore {
  settings: Settings;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
  resetOnboarding: () => void;
  toggleNotifications: () => void;
  toggleAutoPlayNext: () => void;
  toggleDeveloperMode: () => void;
}

const defaultSettings: Settings = {
  notificationsEnabled: true,
  autoPlayNext: false,
  fontSize: 'medium',
  language: 'Language',
  onboardingCompleted: false,
  developerMode: false, // Default: ads are enabled
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      updateSetting: (key, value) => {
        try {
          set((state) => ({
            settings: {
              ...state.settings,
              [key]: value,
            },
          }));
        } catch (error) {
          console.error('Error updating setting:', error);
        }
      },

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

      toggleDeveloperMode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            developerMode: !state.settings.developerMode,
          },
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
