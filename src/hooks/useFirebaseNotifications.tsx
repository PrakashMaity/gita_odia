import { FirebaseNotificationData, notificationService } from '@/services/firebase';
import { useNotificationStore } from '@/store/notificationStore';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Daily Sloka data structure
 */
interface DailySloka {
  id: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  Language: string;
  translation: string;
  speaker: string;
  date: string;
}

/**
 * Hook to set up Firebase Cloud Messaging notifications
 * 
 * This hook:
 * - Requests notification permissions
 * - Gets and stores FCM token
 * - Sets up listeners for foreground, background, and quit state notifications
 * - Handles notification navigation and data processing
 * 
 * @returns Helper functions to interact with notifications
 */
export const useFirebaseNotifications = () => {
  const { setDailySloka, setNotificationVisible } = useNotificationStore();
  const cleanupRef = useRef<(() => void) | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const initializeNotifications = async () => {
      // Prevent duplicate initialization
      if (isInitializedRef.current) {
        return;
      }

      try {
        // Request permissions
        const hasPermission = await notificationService.requestPermissions();
        if (!hasPermission) {
          if (__DEV__) {
            console.warn('[Notifications] Permissions not granted');
          }
          return;
        }

        // Get FCM token
        const token = await notificationService.getFCMToken();
        if (!token) {
          if (__DEV__) {
            console.warn('[Notifications] FCM Token not available');
          }
          // Continue anyway - token might be available later
        } else {
          // TODO: Send token to your backend server if needed
          // Example: await sendTokenToBackend(token);
        }

        // Handle notification received in foreground
        const handleNotificationReceived = (data: FirebaseNotificationData) => {
          if (!mounted) return;

          if (__DEV__) {
            console.log('[Notifications] Received:', data);
          }
          
          // Process notification data
          if (data.data?.type === 'dailySloka' && data.data.chapterId) {
            const dailySloka: DailySloka = {
              id: data.data.id || Date.now().toString(),
              chapterId: data.data.chapterId,
              chapterNumber: data.data.chapterNumber || '',
              verseNumber: data.data.verseNumber || '',
              Language: data.data.language || data.title || '',
              translation: data.body || '',
              speaker: data.data.speaker || '',
              date: new Date().toISOString().split('T')[0],
            };
            
            setDailySloka(dailySloka);
            setNotificationVisible(true);
          }
        };

        // Handle notification tapped/opened
        const handleNotificationOpened = (data: FirebaseNotificationData) => {
          if (!mounted) return;

          if (__DEV__) {
            console.log('[Notifications] Opened:', data);
          }
          
          // Navigate based on notification data
          if (data.data?.chapterId) {
            try {
              router.push(`/chapter/${data.data.chapterId}`);
            } catch (error) {
              if (__DEV__) {
                console.error('[Notifications] Navigation error:', error);
              }
            }
          }

          // Process notification data (same as received)
          handleNotificationReceived(data);
        };

        // Set up notification listeners
        const cleanup = notificationService.setupNotificationListeners(
          handleNotificationReceived,
          handleNotificationOpened
        );

        cleanupRef.current = cleanup;
        isInitializedRef.current = true;

        // Optionally subscribe to topics
        // Example: await notificationService.subscribeToTopic('dailySloka');
      } catch (error) {
        if (__DEV__) {
          console.error('[Notifications] Initialization error:', error);
        }
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      mounted = false;
      isInitializedRef.current = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [setDailySloka, setNotificationVisible]);

  // Return helper functions with useCallback to prevent unnecessary re-renders
  const getFCMToken = useCallback(async () => {
    return await notificationService.getFCMToken();
  }, []);

  const subscribeToTopic = useCallback(async (topic: string) => {
    return await notificationService.subscribeToTopic(topic);
  }, []);

  const unsubscribeFromTopic = useCallback(async (topic: string) => {
    return await notificationService.unsubscribeFromTopic(topic);
  }, []);

  return {
    getFCMToken,
    subscribeToTopic,
    unsubscribeFromTopic,
  };
};

