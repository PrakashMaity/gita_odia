import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { getCurrentDeviceInfo } from './deviceRegistration';
import { getLanguageCode } from './firebase/utils/languageUtils';
import { supabase } from './supabaseClient';

/**
 * Request notification permissions and get FCM token
 */
async function getFCMToken(): Promise<string | null> {
  try {
    // Request permission (iOS only, Android permissions are handled at runtime)
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('User has not granted notification permission');
        return null;
      }
    }

    // Get FCM token
    const token = await messaging().getToken();
    console.log('FCM token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Register device for push notifications using Firebase FCM
 */
export async function registerDeviceForPushNotifications(): Promise<void> {
  try {
    const fcmToken =
      Platform.OS === 'android' || Platform.OS === 'ios'
        ? await getFCMToken()
        : null;

    if (!fcmToken) {
      console.log('No FCM token available');
      return;
    }

    const deviceInfo = await getCurrentDeviceInfo();
    const clientCode = getLanguageCode();

    // Try to upsert with fcm_token first, fallback to expo_push_token if column doesn't exist
    let upsertData: Record<string, any> = {
      device_id: deviceInfo.deviceId,
      platform: deviceInfo.platform,
      client_code: clientCode,
      updated_at: new Date().toISOString(),
    };

    // Try fcm_token first (preferred)
    const { error: fcmError } = await supabase.from('devices').upsert(
      {
        ...upsertData,
        fcm_token: fcmToken,
      },
      {
        onConflict: 'device_id',
      }
    );

    // Check if error is due to missing fcm_token column (PGRST204 = column not found)
    const isColumnNotFoundError = fcmError && (
      fcmError.code === 'PGRST204' ||
      fcmError.message?.includes("fcm_token") ||
      fcmError.message?.includes("Could not find")
    );

    // If fcm_token column doesn't exist, try expo_push_token as fallback
    if (isColumnNotFoundError) {
      console.warn('fcm_token column not found, using expo_push_token as fallback');
      const { error: expoError } = await supabase.from('devices').upsert(
        {
          ...upsertData,
          expo_push_token: fcmToken, // Store FCM token in expo_push_token column temporarily
        },
        {
          onConflict: 'device_id',
        }
      );

      if (expoError) {
        console.error('Error registering device FCM token with Supabase:', expoError);
        throw expoError;
      } else {
        console.log('Successfully registered FCM token (using expo_push_token column)');
        console.warn('⚠️ Please add fcm_token column to your devices table.');
        console.warn('   Run the SQL migration: supabase_migration_add_fcm_token.sql');
      }
    } else if (fcmError) {
      console.error('Error registering device FCM token with Supabase:', fcmError);
      throw fcmError;
    } else {
      console.log('Successfully registered FCM token');
    }
  } catch (error) {
    console.error('Failed to register device for push notifications:', error);
  }
}

/**
 * Set up FCM notification handlers
 * Call this in your app initialization (e.g., in _layout.tsx)
 * 
 * Note: To send FCM notifications from your Supabase backend:
 * 1. Use Supabase Edge Functions with the Firebase Admin SDK
 * 2. Query the 'devices' table to get fcm_token values
 * 3. Use admin.messaging().send() or sendEach() to send notifications
 * 
 * Example Supabase Edge Function:
 * ```typescript
 * import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
 * import admin from 'npm:firebase-admin@^12.0.0'
 * 
 * // Initialize Firebase Admin (use your service account key)
 * const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT') || '{}')
 * admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
 * 
 * serve(async (req) => {
 *   const { data: devices } = await supabase
 *     .from('devices')
 *     .select('fcm_token')
 *     .not('fcm_token', 'is', null)
 * 
 *   const tokens = devices.map(d => d.fcm_token)
 *   const messages = tokens.map(token => ({
 *     token,
 *     notification: { title: 'Title', body: 'Body' },
 *     data: { key: 'value' }
 *   }))
 * 
 *   const response = await admin.messaging().sendEach(messages)
 *   return new Response(JSON.stringify({ success: response.successCount }))
 * })
 * ```
 */
export function setupFCMNotificationHandlers(): void {
  // Handle foreground notifications
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground notification received:', remoteMessage);
    // You can show a local notification here if needed
    // For now, FCM will handle displaying the notification automatically
  });

  // Handle notification when app is opened from background/quit state
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification opened app from quit state:', remoteMessage);
        // Handle navigation or other actions based on notification data
      }
    });

  // Handle notification when app is in background
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app from background:', remoteMessage);
    // Handle navigation or other actions based on notification data
  });

  // Handle token refresh
  messaging().onTokenRefresh(async (token) => {
    console.log('FCM token refreshed:', token);
    // Re-register the device with the new token
    await registerDeviceForPushNotifications();
  });
}


