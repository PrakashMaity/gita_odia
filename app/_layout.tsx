import { ErrorBoundary } from '@/components/ErrorBoundary';
import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemeProvider } from '@/hooks/useTheme';
import { useChapterStore } from '@/store';
import { ClientFonts } from '@/utils/assets';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeFirebase } from '@/services/firebase/initializeFirebase';
import { initializeDeviceRegistration, syncDeviceDataWhenOnline } from '@/services/deviceRegistration';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Splash screen may have already hidden */
});

// Note: expo-keep-awake error suppression is handled in index.js
// (It must be set up before any modules are imported)

export default function RootLayout() {
  const { loadAllChapters } = useChapterStore();
  const [appIsReady, setAppIsReady] = useState(false);
  
  const [loaded, error] = useFonts(ClientFonts);

  // Initialize Firebase
  useEffect(() => {
    initializeFirebase();
  }, []);

  // Initialize device registration
  useEffect(() => {
    initializeDeviceRegistration();
  }, []);

  // Sync device data periodically and when app comes to foreground
  useEffect(() => {
    // Initial sync attempt
    const syncInterval = setInterval(() => {
      syncDeviceDataWhenOnline();
    }, 60000); // Sync every minute

    // Also sync when app comes to foreground (handled by syncDeviceDataWhenOnline internally)
    
    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  // Initialize app resources
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadAllChapters();
      } catch (error) {
        console.error('Error loading chapters:', error);
      } finally {
        // Mark app as ready once everything is loaded
        setAppIsReady(true);
      }
    };
    
    if (loaded || error) {
      initializeApp();
    }
  }, [loaded, error, loadAllChapters]);

  // Hide splash screen when app is ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Don't render app until ready
  if (!appIsReady) {
    return null;
  }
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <ThemeProvider>
          <ThemedSafeAreaView>
            <ThemedView variant='secondary' style={{ flex: 1 }}>
           
            <StatusBar style={"auto"} />
              <Stack screenOptions={{
                headerShown: false,
              }}>
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="chapter/[id]" />
                <Stack.Screen name="translation/[id]" />
                <Stack.Screen name="search" />
                <Stack.Screen name="favorites" />
                <Stack.Screen name="gita-summary" />
                <Stack.Screen name="gita-mahatmya" />
                <Stack.Screen name="mangalacharan" />
                <Stack.Screen name="dhyana" />
                <Stack.Screen name="translations" />
              </Stack>
            </ThemedView>
          </ThemedSafeAreaView>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
