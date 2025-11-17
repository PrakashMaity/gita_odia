import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabaseClient';
import { getCurrentDeviceInfo } from './deviceRegistration';
import { getLanguageCode } from './firebase/utils/languageUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForExpoPushTokenAsync(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  try {
    const projectId = '4276c4fa-4062-4c56-9fb4-26fabacd8a23';
    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return tokenResponse.data;
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    return null;
  }
}

export async function registerDeviceForPushNotifications(): Promise<void> {
  try {
    const expoPushToken =
      Platform.OS === 'android' || Platform.OS === 'ios'
        ? await registerForExpoPushTokenAsync()
        : null;

    if (!expoPushToken) {
      return;
    }

    const deviceInfo = await getCurrentDeviceInfo();
    const clientCode = getLanguageCode();

    const { error } = await supabase.from('devices').upsert(
      {
        device_id: deviceInfo.deviceId,
        platform: deviceInfo.platform,
        expo_push_token: expoPushToken,
        client_code: clientCode,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'device_id',
      }
    );

    if (error) {
      console.error('Error registering device push token with Supabase:', error);
    }
  } catch (error) {
    console.error('Failed to register device for push notifications:', error);
  }
}


