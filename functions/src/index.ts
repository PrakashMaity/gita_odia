/**
 * NOTE: This file contains Firebase Cloud Functions for sending FCM notifications.
 * 
 * Since you're using Supabase for your backend, you can:
 * 1. Use Supabase Edge Functions instead (recommended)
 * 2. Use your own backend service
 * 3. Keep this as a reference or for future use
 * 
 * To send FCM notifications from Supabase:
 * - Create a Supabase Edge Function
 * - Use Firebase Admin SDK (npm:firebase-admin) in the Edge Function
 * - Query your Supabase 'devices' table for fcm_token values
 * - Use admin.messaging().sendEach() to send notifications
 * 
 * See pushNotifications.ts for client-side FCM setup and example Edge Function code.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

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
 * Fetch FCM Tokens from Supabase devices table via Firestore
 * Note: This assumes you're syncing device tokens from Supabase to Firestore
 * Alternatively, you can query Supabase directly if you have the Supabase client set up
 */
async function getFCMTokensFromFirestore(language?: string): Promise<string[]> {
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
        // Support both fcm_token and token field names for migration
        const token = data.fcm_token || data.token;
        if (token && typeof token === 'string' && token.length > 0) {
          tokens.push(token);
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
          // Support both fcm_token and token field names for migration
          const token = data.fcm_token || data.token;
          if (token && typeof token === 'string' && token.length > 0) {
            tokens.push(token);
          }
        });
      }
    }

    return tokens;
  } catch (error) {
    console.error('Error fetching FCM Tokens from Firestore:', error);
    return [];
  }
}

/**
 * Send FCM Push Notifications
 */
async function sendFCMPushNotifications(
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, any>
): Promise<{ successCount: number; failureCount: number }> {
  if (tokens.length === 0) {
    return { successCount: 0, failureCount: 0 };
  }

  // Filter out invalid/empty tokens
  const validTokens = tokens.filter((token) => token && typeof token === 'string' && token.length > 0);
  
  if (validTokens.length === 0) {
    console.warn('No valid FCM Tokens found');
    return { successCount: 0, failureCount: 0 };
  }

  // Create FCM messages
  const messages = validTokens.map((token) => ({
    token: token,
    notification: {
      title: title,
      body: body,
    },
    data: {
      ...Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {} as Record<string, string>),
    },
    android: {
      priority: 'high' as const,
      notification: {
        sound: 'default',
        channelId: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  }));

  // Send messages in batches (FCM allows up to 500 messages per batch)
  const batchSize = 500;
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    try {
      const response = await admin.messaging().sendEach(batch);
      successCount += response.successCount;
      failureCount += response.failureCount;
      
      // Log any failures
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Failed to send to token ${batch[idx].token}:`, resp.error);
        }
      });
    } catch (error) {
      console.error('Error sending FCM notification batch:', error);
      failureCount += batch.length;
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
    console.info('Starting scheduled daily sloka notification...');
    
    try {
      const sloka = getDailySloka();
      const today = new Date().toISOString().split('T')[0];
      const notificationId = `daily-sloka-${today}-${Date.now()}`;

      // Get all active FCM Tokens from Firestore
      const tokens = await getFCMTokensFromFirestore();

      if (tokens.length === 0) {
        console.info('No active FCM Tokens found in Firestore');
        return {
          success: true,
          message: 'No tokens to send notifications to',
          tokenCount: 0,
        };
      }

      console.info(`Sending notifications to ${tokens.length} devices...`);

      // Send notifications
      const result = await sendFCMPushNotifications(
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

      console.info(`✅ Successfully sent ${result.successCount} notifications`);
      console.info(`❌ Failed to send ${result.failureCount} notifications`);

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
 * Query params: ?token=FCM_TOKEN or ?language=bn
 */
export const sendTestNotification = functions.https.onRequest(async (req, res) => {
  try {
    const { token, language } = req.query;
    
    if (!token && !language) {
      res.status(400).json({ 
        error: 'Please provide either "token" (FCM Token) or "language" (e.g., bn) query parameter' 
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
      if (!tokenStr || tokenStr.length === 0) {
        res.status(400).json({ error: 'Invalid FCM Token format' });
        return;
      }
      tokens = [tokenStr];
    } else {
      // Send to all tokens for a language
      tokens = await getFCMTokensFromFirestore(language as string);
      if (tokens.length === 0) {
        res.status(404).json({ 
          error: `No active tokens found for language: ${language}` 
        });
        return;
      }
    }

    const result = await sendFCMPushNotifications(
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
 * HTTP-triggered function to send notification to specific FCM Token
 * POST /sendNotificationToToken
 * Body: { "token": "FCM_TOKEN", "title": "optional", "body": "optional" }
 */
export const sendNotificationToToken = functions.https.onRequest(async (req, res) => {
  try {
    const { token, title, body, chapterId, chapterNumber, verseNumber } = req.body;
    
    if (!token || typeof token !== 'string' || token.length === 0) {
      res.status(400).json({ error: 'FCM Token is required and must be a valid string' });
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

    const result = await sendFCMPushNotifications(
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

