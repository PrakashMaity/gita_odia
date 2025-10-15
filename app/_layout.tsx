import { ErrorBoundary } from '@/components/ErrorBoundary';
import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useChapterStore } from '@/store';
import { ClientFonts } from '@/utils/assets';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../hooks/useTheme';


export default function RootLayout() {
  const { loadAllChapters } = useChapterStore();
  
  const [loaded, error] = useFonts(ClientFonts);

  // Initialize chapter data when app starts
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadAllChapters();
      } catch (error) {
        console.error('Error loading chapters:', error);
      }
    };
    
    initializeApp();
  }, [loadAllChapters]);

  if (error) {
    console.error('Font loading error:', error);
    // Continue with app even if fonts fail to load
  }

  if (!loaded) {
    return null;
  }
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
