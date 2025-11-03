# Firebase Cloud Messaging (FCM) Setup Guide

## Overview
This app is configured to receive push notifications from Firebase Cloud Messaging. Notifications are automatically received when sent from Firebase Console or your backend.

## Setup Steps

### 1. Download Google Services Configuration Files

You need to download the configuration files from Firebase Console:

#### For Android:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gita-3be35`
3. Go to Project Settings (⚙️ icon)
4. Under "Your apps", select your Android app
5. Download `google-services.json`
6. Place it in the root directory: `/Users/prakash/Documents/Bangla/gita_main/google-services.json`

#### For iOS:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gita-3be35`
3. Go to Project Settings (⚙️ icon)
4. Under "Your apps", select your iOS app
5. Download `GoogleService-Info.plist`
6. Place it in the root directory: `/Users/prakash/Documents/Bangla/gita_main/GoogleService-Info.plist`

### 2. Rebuild the App

After adding the configuration files, you need to rebuild:

```bash
# For Android
npx expo prebuild --clean
npm run android

# For iOS
npx expo prebuild --clean
npm run ios
```

### 3. Testing Notifications

#### Send Test Notification from Firebase Console:
1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Click "Send test message"
5. Enter your FCM token (check console logs in the app)
6. Send the notification

#### Notification Payload Format:
For daily sloka notifications, use this format:
```json
{
  "notification": {
    "title": "Daily Sloka",
    "body": "Your daily Bhagavad Gita verse"
  },
  "data": {
    "type": "dailySloka",
    "chapterId": "1",
    "chapterNumber": "Chapter 1",
    "verseNumber": "1",
    "language": "Verse text in Bengali",
    "translation": "Translation text",
    "speaker": "Speaker name"
  }
}
```

## How It Works

### Notification States:
1. **Foreground**: When app is open, notifications are shown as in-app notifications
2. **Background**: When app is in background, notifications appear in system notification tray
3. **Killed/Quit**: When app is closed, notifications appear in system tray and can open the app

### Automatic Features:
- ✅ Automatic permission requests
- ✅ FCM token generation and refresh
- ✅ Notification handling in all app states
- ✅ Automatic navigation to chapters when notification is tapped
- ✅ Integration with existing DailySloka notification system

## Code Structure

- `src/services/firebase/config.ts` - Firebase configuration
- `src/services/firebase/notificationService.ts` - Notification handling service
- `src/services/firebase/initializeFirebase.ts` - Firebase initialization
- `src/hooks/useFirebaseNotifications.tsx` - React hook for notifications
- `app/_layout.tsx` - Initializes Firebase on app start

## Troubleshooting

### Notifications not working?
1. Verify `google-services.json` and `GoogleService-Info.plist` are in root directory
2. Rebuild the app after adding config files
3. Check app permissions are granted
4. Verify FCM token is generated (check console logs)
5. Ensure Firebase project has Cloud Messaging API enabled

### Build errors?
- Make sure you've run `npx expo prebuild` after adding config files
- Check that `@react-native-firebase/app` and `@react-native-firebase/messaging` are installed
- For iOS, ensure CocoaPods are installed: `cd ios && pod install`

## Additional Resources
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase Docs](https://rnfirebase.io/)
- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)

