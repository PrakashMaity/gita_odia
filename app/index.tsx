import { useSettingsStore } from '@/store';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        // Add a small delay to ensure stores are properly initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on onboarding status
        if (settings.onboardingCompleted) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to onboarding
        router.replace('/onboarding');
      }
    };

    handleNavigation();
  }, [settings.onboardingCompleted]);

  return null; // This screen doesn't render anything
}