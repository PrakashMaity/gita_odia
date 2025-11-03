import { useEffect, useRef } from 'react';
import { notificationService, FirebaseNotificationData } from '@/services/firebase';
import { useNotificationStore } from '@/store/notificationStore';
import { router } from 'expo-router';

/**
 * Hook to set up Firebase Cloud Messaging notifications
 */
export const useFirebaseNotifications = () => {
  const { setDailySloka, setNotificationVisible } = useNotificationStore();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeNotifications = async () => {
      try {
        // Request permissions
        const hasPermission = await notificationService.requestPermissions();
        if (!hasPermission) {
          console.warn('Notification permissions not granted');
          return;
        }

        // Get FCM token
        const token = await notificationService.getFCMToken();
        if (token) {
          // Token is already logged prominently in notificationService
          // You can send this token to your backend if needed
          // await sendTokenToBackend(token);
        } else {
          console.warn('⚠️ FCM Token not available');
        }

        // Handle notification received in foreground
        const handleNotificationReceived = (data: FirebaseNotificationData) => {
          console.log('Notification received:', data);
          
          // Process notification data based on your needs
          if (data.data) {
            // If it's a daily sloka notification
            if (data.data.type === 'dailySloka' && data.data.chapterId) {
              const dailySloka = {
                id: data.data.id || Date.now().toString(),
                chapterId: data.data.chapterId,
                chapterNumber: data.data.chapterNumber || '',
                verseNumber: data.data.verseNumber || '',
                Language: data.data.language || data.title || '',
                translation: data.body || '',
                speaker: data.data.speaker || '',
                date: new Date().toISOString().split('T')[0],
              };
              
              if (mounted) {
                setDailySloka(dailySloka);
              }
            }
          }
        };

        // Handle notification tapped/opened
        const handleNotificationOpened = (data: FirebaseNotificationData) => {
          console.log('Notification opened:', data);
          
          // Navigate based on notification data
          if (data.data) {
            if (data.data.type === 'dailySloka' && data.data.chapterId) {
              // Navigate to chapter
              router.push(`/chapter/${data.data.chapterId}`);
            } else if (data.data.chapterId) {
              // Navigate to specific chapter
              router.push(`/chapter/${data.data.chapterId}`);
            }
          }

          // Process notification similar to received
          handleNotificationReceived(data);
        };

        // Set up notification listeners
        const cleanup = notificationService.setupNotificationListeners(
          handleNotificationReceived,
          handleNotificationOpened
        );

        cleanupRef.current = cleanup;

        // Optionally subscribe to topics
        // await notificationService.subscribeToTopic('all');
        // await notificationService.subscribeToTopic('dailySloka');
      } catch (error) {
        console.error('Error initializing Firebase notifications:', error);
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [setDailySloka, setNotificationVisible]);

  return {
    getFCMToken: () => notificationService.getFCMToken(),
    subscribeToTopic: (topic: string) => notificationService.subscribeToTopic(topic),
    unsubscribeFromTopic: (topic: string) => notificationService.unsubscribeFromTopic(topic),
  };
};

