import { useSettingsStore } from '@/store';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    // Redirect based on onboarding status
    if (settings.onboardingCompleted) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [settings.onboardingCompleted]);

  return null; // This screen doesn't render anything
}