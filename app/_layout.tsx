import { ErrorBoundary } from '@/components/ErrorBoundary';
import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { TRANSITION_ANIMATIONS } from '@/constants/navigationTransitions';
import { ThemeProvider, useThemeColors } from '@/hooks/useTheme';
import { initializeDeviceRegistration, syncDeviceDataWhenOnline } from '@/services/deviceRegistration';
import { initializeFirebase } from '@/services/firebase/initializeFirebase';
import { fetchNotificationsWithRetry } from '@/services/notificationService';
import { registerDeviceForPushNotifications, setupFCMNotificationHandlers } from '@/services/pushNotifications';
import { useChapterStore } from '@/store';
import { ClientFonts } from '@/utils/assets';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, StatusBar as RNStatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Splash screen may have already hidden */
});

const ThemedStatusBar = () => {
  const theme = useThemeColors();
  const backgroundColor = theme.background.tertiary;

  useEffect(() => {
    RNStatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor(backgroundColor, true);
      RNStatusBar.setTranslucent(false);
    }
  }, [backgroundColor]);

  return (
    <ExpoStatusBar style="light" backgroundColor={backgroundColor} translucent={false} />
  );
};


export default function RootLayout() {
  const { loadAllChapters } = useChapterStore();
  const [appIsReady, setAppIsReady] = useState(false);
  
  const [loaded, error] = useFonts(ClientFonts);
  // Initialize Firebase
  useEffect(() => {
    initializeFirebase();
    // Set up FCM notification handlers
    setupFCMNotificationHandlers();
  }, []);

  // Initialize device registration
  useEffect(() => {
    initializeDeviceRegistration();
  }, []);

  // Register device for push notifications via Firebase FCM
  useEffect(() => {
    // Android 13+ requires runtime permission; iOS permissions are handled by FCM
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      )
        .then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            registerDeviceForPushNotifications().catch((error) => {
              console.error('Error registering push notifications:', error);
            });
          }
        })
        .catch((error) => {
          console.error('Error requesting notification permission:', error);
        });
    } else {
      registerDeviceForPushNotifications().catch((error) => {
        console.error('Error registering push notifications:', error);
      });
    }
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
        // Load chapters and notifications in parallel
        await Promise.all([
          loadAllChapters(),
          fetchNotificationsWithRetry().catch(() => {
            // Silently fail for notifications - they'll be fetched when user visits the page
          }),
        ]);
      } catch (error) {
        console.error('Error loading app resources:', error);
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
          <ThemedSafeAreaView variant='tertiary'>
            <ThemedView variant='secondary' style={{ flex: 1 }}>
              <ThemedStatusBar />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: TRANSITION_ANIMATIONS.default,
                  contentStyle: {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <Stack.Screen 
                  name="onboarding" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.fade,
                  }}
                />
                <Stack.Screen 
                  name="(tabs)" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.fade,
                  }}
                />
                <Stack.Screen 
                  name="chapter/[id]" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="translation/[id]" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="search" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.fadeFromBottom,
                  }}
                />
                <Stack.Screen 
                  name="favorites" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="gita-summary" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="gita-mahatmya" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="mangalacharan" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="dhyana" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="mala-japa" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="translations" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.default,
                  }}
                />
                <Stack.Screen 
                  name="notifications" 
                  options={{
                    animation: TRANSITION_ANIMATIONS.fadeFromBottom,
                  }}
                />
              </Stack>
            </ThemedView>
          </ThemedSafeAreaView>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
