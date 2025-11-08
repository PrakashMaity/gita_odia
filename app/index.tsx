import { useSettingsStore } from '@/store';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
  const { settings, _hasHydrated } = useSettingsStore();

  useEffect(() => {
    // Wait for hydration before navigating
    if (!_hasHydrated) {
      return;
    }

    const handleNavigation = async () => {
      try {
        // Small delay to ensure navigation is ready
        await new Promise(resolve => setTimeout(resolve, 50));
        
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
  }, [_hasHydrated, settings.onboardingCompleted]);

  // Show loading indicator while waiting for hydration
  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return null;
}