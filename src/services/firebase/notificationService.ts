import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Lazy import Firebase messaging to avoid errors if config files are missing
let messagingModule: any = null;
let getMessagingFunction: any = null;
let AuthorizationStatus: any = null;

const getMessaging = () => {
  if (messagingModule === null) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const messaging = require('@react-native-firebase/messaging');
      messagingModule = messaging.default;
      // Try to use modular API if available, otherwise fall back to default
      getMessagingFunction = messaging.getMessaging || messaging.default;
      // AuthorizationStatus is a static property on the module
      AuthorizationStatus = messaging.AuthorizationStatus || messaging.default.AuthorizationStatus;
    } catch {
      console.warn('Firebase messaging not available');
      return null;
    }
  }
  try {
    // Use getApp from @react-native-firebase/app if available for modular API
    // Otherwise fall back to default instance
    if (getMessagingFunction && getMessagingFunction !== messagingModule) {
      const { getApp } = require('@react-native-firebase/app');
      const app = getApp();
      return getMessagingFunction(app);
    }
    return messagingModule();
  } catch {
    try {
      // Fallback to default instance
      return messagingModule();
    } catch {
      console.warn('Firebase app not initialized yet');
      return null;
    }
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

export interface FirebaseNotificationData {
  title?: string;
  body?: string;
  data?: {
    chapterId?: string;
    verseNumber?: string;
    type?: string;
    [key: string]: any;
  };
}

class NotificationService {
  private fcmToken: string | null = null;

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Request Android permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.warn('Failed to get push notification permissions!');
          return false;
        }

        // Create notification channel for Android
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      } else {
        // Request iOS permissions
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        
        if (status !== 'granted') {
          console.warn('Failed to get push notification permissions!');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Get FCM token for this device
   */
  async getFCMToken(): Promise<string | null> {
    try {
      const messagingInstance = getMessaging();
      if (!messagingInstance) {
        console.warn('Firebase messaging not available - config files may be missing');
        return null;
      }

      // Check if permission is granted
      const authStatus = await messagingInstance.requestPermission();
      
      // AuthorizationStatus is a static property, not on the instance
      if (!AuthorizationStatus) {
        console.warn('AuthorizationStatus not available - Firebase may not be fully initialized');
        return null;
      }
      
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.warn('User has not granted permission for notifications');
        return null;
      }

      // Get FCM token
      const token = await messagingInstance.getToken();
      this.fcmToken = token;
      
      // Log FCM token prominently
      console.log('==========================================');
      console.log('🔥 FCM TOKEN (Firebase Cloud Messaging) 🔥');
      console.log('==========================================');
      console.log(token);
      console.log('==========================================');
      console.log('Copy this token to send notifications to this device');
      console.log('==========================================');
      
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
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
   */
  setupNotificationListeners(
    onNotificationReceived: (data: FirebaseNotificationData) => void,
    onNotificationOpened: (data: FirebaseNotificationData) => void
  ) {
    const messagingInstance = getMessaging();
    if (!messagingInstance) {
      console.warn('Firebase messaging not available - cannot set up listeners');
      return () => {}; // Return empty cleanup function
    }

    // Handle notifications when app is in FOREGROUND
    const unsubscribeForeground = messagingInstance.onMessage(async (remoteMessage: any) => {
      console.log('Notification received in foreground:', remoteMessage);
      
      const notificationData: FirebaseNotificationData = {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
      };

      // Show local notification when app is in foreground
      if (remoteMessage.notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification.title || 'Notification',
            body: remoteMessage.notification.body || '',
            data: remoteMessage.data || {},
            sound: true,
          },
          trigger: null, // Show immediately
        });
      }

      onNotificationReceived(notificationData);
    });

    // Handle notifications when app is in BACKGROUND
    messagingInstance.onNotificationOpenedApp((remoteMessage: any) => {
      console.log('Notification opened app from background:', remoteMessage);
      
      const notificationData: FirebaseNotificationData = {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
      };

      onNotificationOpened(notificationData);
    });

    // Handle notifications when app is KILLED/QUIT
    messagingInstance
      .getInitialNotification()
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage);
          
          const notificationData: FirebaseNotificationData = {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data,
          };

          // Delay to ensure app is fully initialized
          setTimeout(() => {
            onNotificationOpened(notificationData);
          }, 1000);
        }
      });

    // Handle token refresh
    const unsubscribeTokenRefresh = messagingInstance.onTokenRefresh((token: string) => {
      console.log('FCM Token refreshed:', token);
      this.fcmToken = token;
    });

    // Note: Background message handler is registered in index.js
    // (setBackgroundMessageHandler must be at root level)

    // Handle notification tap when app is running
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Expo notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
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
      unsubscribeTokenRefresh();
      notificationListener.remove();
      responseListener.remove();
    };
  }

  /**
   * Subscribe to a topic
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      const messagingInstance = getMessaging();
      if (!messagingInstance) {
        console.warn('Firebase messaging not available');
        return;
      }
      await messagingInstance.subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  /**
   * Unsubscribe from a topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      const messagingInstance = getMessaging();
      if (!messagingInstance) {
        console.warn('Firebase messaging not available');
        return;
      }
      await messagingInstance.unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }
}

export const notificationService = new NotificationService();

