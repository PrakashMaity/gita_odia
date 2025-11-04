import { getApp } from '@react-native-firebase/app';
import { AuthorizationStatus, FirebaseMessagingTypes, getMessaging } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Get Firebase messaging instance using modular API
 * Returns null if Firebase is not initialized (config files missing)
 * 
 * @see https://rnfirebase.io/migrating-to-v22
 */
const getMessagingInstance = (): ReturnType<typeof getMessaging> | null => {
  try {
    // Use modular API: getMessaging(app) instead of messaging()
    // React Native Firebase auto-initializes from config files
    const app = getApp();
    return getMessaging(app);
  } catch (error) {
    // Firebase not initialized - config files may be missing
    if (__DEV__) {
      console.warn('[Firebase] Messaging not available:', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
};

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Notification data structure
 */
export interface FirebaseNotificationData {
  title?: string;
  body?: string;
  data?: {
    chapterId?: string;
    verseNumber?: string;
    chapterNumber?: string;
    id?: string;
    language?: string;
    speaker?: string;
    type?: string;
    [key: string]: any;
  };
}

/**
 * Extract notification data from Firebase remote message
 */
const extractNotificationData = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): FirebaseNotificationData => {
  return {
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    data: remoteMessage.data || {},
  };
};

class NotificationService {
  private fcmToken: string | null = null;

  /**
   * Request notification permissions
   * Handles both Expo Notifications and Firebase Messaging permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // Request Expo Notifications permissions first
      if (Platform.OS === 'android') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          if (__DEV__) {
            console.warn('[Notifications] Android permissions not granted');
          }
          return false;
        }

        // Create notification channel for Android
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          description: 'Default notification channel',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          enableLights: true,
          enableVibrate: true,
        });
      } else {
        // iOS permissions
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        
        if (status !== 'granted') {
          if (__DEV__) {
            console.warn('[Notifications] iOS permissions not granted');
          }
          return false;
        }
      }

      // Request Firebase Messaging permissions (iOS only)
      if (Platform.OS === 'ios') {
        const messagingInstance = getMessagingInstance();
        if (messagingInstance) {
          try {
            const authStatus = await messagingInstance.requestPermission();
            const enabled =
              authStatus === AuthorizationStatus.AUTHORIZED ||
              authStatus === AuthorizationStatus.PROVISIONAL;
            
            if (!enabled) {
              if (__DEV__) {
                console.warn('[Firebase] Messaging permissions not granted');
              }
              return false;
            }
          } catch (error) {
            if (__DEV__) {
              console.error('[Firebase] Error requesting messaging permissions:', error);
            }
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      if (__DEV__) {
        console.error('[Notifications] Error requesting permissions:', error);
      }
      return false;
    }
  }

  /**
   * Get FCM token for this device
   * Returns null if Firebase is not initialized or permissions are not granted
   */
  async getFCMToken(): Promise<string | null> {
    try {
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) {
        if (__DEV__) {
          console.warn('[Firebase] Messaging not available - config files may be missing');
        }
        return null;
      }

      // Check permissions (iOS only - Android permissions are handled by Expo)
      if (Platform.OS === 'ios') {
        const authStatus = await messagingInstance.requestPermission();
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          if (__DEV__) {
            console.warn('[Firebase] User has not granted permission for notifications');
          }
          return null;
        }
      }

      // Get FCM token
      const token = await messagingInstance.getToken();
      this.fcmToken = token;
      
      if (__DEV__) {
        console.log('==========================================');
        console.log('🔥 FCM TOKEN (Firebase Cloud Messaging) 🔥');
        console.log('==========================================');
        console.log(token);
        console.log('==========================================');
        console.log('Copy this token to send notifications to this device');
        console.log('==========================================');
      }
      
      return token;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase] Error getting FCM token:', error);
      }
      return null;
    }
  }

  /**
   * Get current FCM token if already fetched
   */
  getCurrentToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Setup notification listeners
   * Returns a cleanup function to remove all listeners
   */
  setupNotificationListeners(
    onNotificationReceived: (data: FirebaseNotificationData) => void,
    onNotificationOpened: (data: FirebaseNotificationData) => void
  ): () => void {
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) {
      if (__DEV__) {
        console.warn('[Firebase] Messaging not available - cannot set up listeners');
      }
      return () => {}; // Return empty cleanup function
    }

    // Handle notifications when app is in FOREGROUND
    const unsubscribeForeground = messagingInstance.onMessage(async (remoteMessage) => {
      if (__DEV__) {
        console.log('[Firebase] Notification received in foreground:', remoteMessage);
      }
      
      const notificationData = extractNotificationData(remoteMessage);

      // Show local notification when app is in foreground
      // This ensures users see the notification even when app is open
      if (remoteMessage.notification) {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification.title || 'Notification',
              body: remoteMessage.notification.body || '',
              data: remoteMessage.data || {},
              sound: true,
              badge: 1,
            },
            trigger: null, // Show immediately
          });
        } catch (error) {
          if (__DEV__) {
            console.error('[Notifications] Error showing local notification:', error);
          }
        }
      }

      onNotificationReceived(notificationData);
    });

    // Handle notifications when app is opened from BACKGROUND state
    const unsubscribeBackgroundOpened = messagingInstance.onNotificationOpenedApp((remoteMessage) => {
      if (__DEV__) {
        console.log('[Firebase] Notification opened app from background:', remoteMessage);
      }
      
      const notificationData = extractNotificationData(remoteMessage);
      onNotificationOpened(notificationData);
    });

    // Handle notifications when app is opened from KILLED/QUIT state
    // This is a promise, not a subscription, so we handle it once
    messagingInstance
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          if (__DEV__) {
            console.log('[Firebase] Notification opened app from quit state:', remoteMessage);
          }
          
          const notificationData = extractNotificationData(remoteMessage);

          // Small delay to ensure app navigation is ready
          setTimeout(() => {
            onNotificationOpened(notificationData);
          }, 500);
        }
      })
      .catch((error) => {
        if (__DEV__) {
          console.error('[Firebase] Error getting initial notification:', error);
        }
      });

    // Handle token refresh
    const unsubscribeTokenRefresh = messagingInstance.onTokenRefresh((token: string) => {
      if (__DEV__) {
        console.log('[Firebase] FCM Token refreshed:', token);
      }
      this.fcmToken = token;
      // TODO: Send updated token to your backend if needed
    });

    // Handle Expo notification taps (for local notifications shown in foreground)
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      if (__DEV__) {
        console.log('[Notifications] Local notification received:', notification);
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      if (__DEV__) {
        console.log('[Notifications] Notification tapped:', response);
      }
      
      const data = response.notification.request.content.data as Record<string, any> | undefined;
      
      const notificationData: FirebaseNotificationData = {
        title: (data?.title as string) || response.notification.request.content.title || undefined,
        body: (data?.body as string) || response.notification.request.content.body || undefined,
        data: data || {},
      };

      onNotificationOpened(notificationData);
    });

    // Return cleanup function
    return () => {
      unsubscribeForeground();
      unsubscribeBackgroundOpened();
      unsubscribeTokenRefresh();
      notificationListener.remove();
      responseListener.remove();
    };
  }

  /**
   * Subscribe to a Firebase Cloud Messaging topic
   */
  async subscribeToTopic(topic: string): Promise<boolean> {
    try {
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) {
        if (__DEV__) {
          console.warn('[Firebase] Messaging not available');
        }
        return false;
      }
      
      await messagingInstance.subscribeToTopic(topic);
      if (__DEV__) {
        console.log(`[Firebase] Subscribed to topic: ${topic}`);
      }
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error(`[Firebase] Error subscribing to topic ${topic}:`, error);
      }
      return false;
    }
  }

  /**
   * Unsubscribe from a Firebase Cloud Messaging topic
   */
  async unsubscribeFromTopic(topic: string): Promise<boolean> {
    try {
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) {
        if (__DEV__) {
          console.warn('[Firebase] Messaging not available');
        }
        return false;
      }
      
      await messagingInstance.unsubscribeFromTopic(topic);
      if (__DEV__) {
        console.log(`[Firebase] Unsubscribed from topic: ${topic}`);
      }
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error(`[Firebase] Error unsubscribing from topic ${topic}:`, error);
      }
      return false;
    }
  }
}

export const notificationService = new NotificationService();

