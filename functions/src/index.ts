import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Initialize Firebase Admin
admin.initializeApp();

// Create Expo client
const expo = new Expo();

/**
 * Daily Sloka data for notifications
 * You can customize this to fetch from your database or use predefined verses
 */
const DAILY_SLOKAS = [
  {
    chapterId: 'chapter1',
    chapterNumber: '1',
    verseNumber: '1',
    title: 'Chapter 1, Verse 1',
    body: 'धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |',
    language: 'Bengali',
    speaker: 'Speaker Name'
  },
  {
    chapterId: 'chapter2',
    chapterNumber: '2',
    verseNumber: '1',
    title: 'Chapter 2, Verse 1',
    body: 'सञ्जय उवाच | तं तथा कृपयाविष्टमश्रुपूर्णाकुलेक्षणम् |',
    language: 'Bengali',
    speaker: 'Speaker Name'
  },
  // Add more verses as needed
];

/**
 * Get a random daily sloka based on day of year
 * In production, you might want to:
 * - Fetch from Firestore
 * - Use a predefined rotation based on date
 * - Select based on user preferences
 */
function getDailySloka() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % DAILY_SLOKAS.length;
  return DAILY_SLOKAS[index];
}

/**
 * Fetch Expo Push Tokens from Firestore
 */
async function getExpoPushTokensFromFirestore(language?: string): Promise<string[]> {
  try {
    const db = admin.firestore();
    const tokens: string[] = [];

    if (language) {
      // Get tokens for specific language
      const snapshot = await db
        .collection('Clients')
        .doc(language)
        .collection('Notification')
        .where('isActive', '==', true)
        .get();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.token && Expo.isExpoPushToken(data.token)) {
          tokens.push(data.token);
        }
      });
    } else {
      // Get all active tokens from all languages
      const clientsSnapshot = await db.collection('Clients').get();
      
      for (const clientDoc of clientsSnapshot.docs) {
        const notificationSnapshot = await clientDoc.ref
          .collection('Notification')
          .where('isActive', '==', true)
          .get();

        notificationSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.token && Expo.isExpoPushToken(data.token)) {
            tokens.push(data.token);
          }
        });
      }
    }

    return tokens;
  } catch (error) {
    console.error('Error fetching Expo Push Tokens from Firestore:', error);
    return [];
  }
}

/**
 * Send Expo Push Notifications
 */
async function sendExpoPushNotifications(
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, any>
): Promise<{ successCount: number; failureCount: number }> {
  if (tokens.length === 0) {
    return { successCount: 0, failureCount: 0 };
  }

  // Filter out invalid tokens
  const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));
  
  if (validTokens.length === 0) {
    console.warn('No valid Expo Push Tokens found');
    return { successCount: 0, failureCount: 0 };
  }

  // Create messages
  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    sound: 'default',
    title: title,
    body: body,
    data: data,
    badge: 1,
  }));

  // Send in chunks (Expo allows max 100 messages per request)
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification chunk:', error);
    }
  }

  // Count successes and failures
  let successCount = 0;
  let failureCount = 0;

  for (const ticket of tickets) {
    if (ticket.status === 'ok') {
      successCount++;
    } else {
      failureCount++;
      console.error('Push notification error:', ticket.message);
    }
  }

  return { successCount, failureCount };
}

/**
 * Scheduled Cloud Function to send daily sloka notifications every 6 hours
 * 
 * Schedule: Every 6 hours
 * This runs at: 00:00, 06:00, 12:00, 18:00 UTC (Asia/Kolkata timezone)
 * 
 * To customize schedule, use cron format in the schedule() call:
 * - Every 6 hours: "0 *\/6 * * *"
 * - Every day at 9 AM: "0 9 * * *"
 * - Every 12 hours: "0 *\/12 * * *"
 */
export const sendDailySlokaNotification = functions.pubsub
  .schedule("0 */6 * * *") // Every 6 hours
  .timeZone("Asia/Kolkata") // Adjust to your timezone
  .onRun(async (context) => {
    console.log('Starting scheduled daily sloka notification...');
    
    try {
      const sloka = getDailySloka();
      const today = new Date().toISOString().split('T')[0];
      const notificationId = `daily-sloka-${today}-${Date.now()}`;

      // Get all active Expo Push Tokens from Firestore
      const tokens = await getExpoPushTokensFromFirestore();

      if (tokens.length === 0) {
        console.log('No active Expo Push Tokens found in Firestore');
        return {
          success: true,
          message: 'No tokens to send notifications to',
          tokenCount: 0,
        };
      }

      console.log(`Sending notifications to ${tokens.length} devices...`);

      // Send notifications
      const result = await sendExpoPushNotifications(
        tokens,
        `Daily Sloka - Chapter ${sloka.chapterNumber}`,
        sloka.body.substring(0, 100) + (sloka.body.length > 100 ? '...' : ''),
        {
          type: 'dailySloka',
          chapterId: sloka.chapterId,
          chapterNumber: sloka.chapterNumber,
          verseNumber: sloka.verseNumber,
          id: notificationId,
          language: sloka.language,
          speaker: sloka.speaker,
          date: today,
        }
      );

      console.log(`✅ Successfully sent ${result.successCount} notifications`);
      console.log(`❌ Failed to send ${result.failureCount} notifications`);

      return {
        success: true,
        successCount: result.successCount,
        failureCount: result.failureCount,
        tokenCount: tokens.length,
      };
    } catch (error) {
      console.error('❌ Error sending daily sloka notification:', error);
      throw error;
    }
  });

/**
 * HTTP-triggered function to send test notification
 * GET/POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/sendTestNotification
 * Query params: ?token=EXPO_PUSH_TOKEN or ?language=bn
 */
export const sendTestNotification = functions.https.onRequest(async (req, res) => {
  try {
    const { token, language } = req.query;
    
    if (!token && !language) {
      res.status(400).json({ 
        error: 'Please provide either "token" (Expo Push Token) or "language" (e.g., bn) query parameter' 
      });
      return;
    }

    const sloka = getDailySloka();
    const today = new Date().toISOString().split('T')[0];
    const notificationId = `test-${Date.now()}`;

    let tokens: string[] = [];

    if (token) {
      // Send to specific token
      const tokenStr = token as string;
      if (!Expo.isExpoPushToken(tokenStr)) {
        res.status(400).json({ error: 'Invalid Expo Push Token format' });
        return;
      }
      tokens = [tokenStr];
    } else {
      // Send to all tokens for a language
      tokens = await getExpoPushTokensFromFirestore(language as string);
      if (tokens.length === 0) {
        res.status(404).json({ 
          error: `No active tokens found for language: ${language}` 
        });
        return;
      }
    }

    const result = await sendExpoPushNotifications(
      tokens,
      `Test - Daily Sloka - Chapter ${sloka.chapterNumber}`,
      sloka.body.substring(0, 100) + (sloka.body.length > 100 ? '...' : ''),
      {
        type: 'dailySloka',
        chapterId: sloka.chapterId,
        chapterNumber: sloka.chapterNumber,
        verseNumber: sloka.verseNumber,
        id: notificationId,
        language: sloka.language,
        speaker: sloka.speaker,
        date: today,
      }
    );
    
    res.json({
      success: true,
      successCount: result.successCount,
      failureCount: result.failureCount,
      sloka: sloka,
      tokensSent: tokens.length,
    });
  } catch (error: any) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to send notification' 
    });
  }
});

/**
 * HTTP-triggered function to send notification to specific Expo Push Token
 * POST /sendNotificationToToken
 * Body: { "token": "ExponentPushToken[...]", "title": "optional", "body": "optional" }
 */
export const sendNotificationToToken = functions.https.onRequest(async (req, res) => {
  try {
    const { token, title, body, chapterId, chapterNumber, verseNumber } = req.body;
    
    if (!token) {
      res.status(400).json({ error: 'Expo Push Token is required' });
      return;
    }

    if (!Expo.isExpoPushToken(token)) {
      res.status(400).json({ error: 'Invalid Expo Push Token format' });
      return;
    }

    const sloka = chapterId ? {
      chapterId,
      chapterNumber: chapterNumber || '1',
      verseNumber: verseNumber || '1',
      title: title || 'Daily Sloka',
      body: body || 'Daily verse from Bhagavad Gita',
      language: 'Bengali',
      speaker: 'Speaker',
    } : getDailySloka();

    const today = new Date().toISOString().split('T')[0];
    const notificationId = `custom-${Date.now()}`;

    const result = await sendExpoPushNotifications(
      [token],
      title || `Daily Sloka - Chapter ${sloka.chapterNumber}`,
      body || sloka.body.substring(0, 100) + (sloka.body.length > 100 ? '...' : ''),
      {
        type: 'dailySloka',
        chapterId: sloka.chapterId,
        chapterNumber: sloka.chapterNumber,
        verseNumber: sloka.verseNumber,
        id: notificationId,
        language: sloka.language,
        speaker: sloka.speaker,
        date: today,
      }
    );

    if (result.successCount > 0) {
      res.json({
        success: true,
        message: 'Notification sent successfully',
        sloka: sloka,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send notification',
      });
    }
  } catch (error: any) {
    console.error('Error sending notification to token:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to send notification' 
    });
  }
});

