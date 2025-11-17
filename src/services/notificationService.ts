import '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore/lib/modular';
import { getLanguageCode } from './firebase/utils/languageUtils';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'update' | 'promotion' | 'reminder' | 'info';
  isRead: boolean;
  createdAt?: number;
}

export interface FirestoreNotification {
  id: string;
  title: string;
  body: string;
  type?: 'update' | 'promotion' | 'reminder' | 'info';
  createdAt: any; // Firestore Timestamp
}

/**
 * Convert Firestore notification to app notification item
 */
function convertFirestoreNotification(
  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
): NotificationItem {
  const data = doc.data() as FirestoreNotification;
  const createdAt = data.createdAt?.toMillis?.() || Date.now();
  const date = new Date(createdAt);
  
  // Format time relative to now
  const now = Date.now();
  const diff = now - createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  let timeString = '';
  if (minutes < 1) {
    timeString = 'Just now';
  } else if (minutes < 60) {
    timeString = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    timeString = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    timeString = `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    timeString = date.toLocaleDateString();
  }

  return {
    id: doc.id,
    title: data.title || '',
    message: data.body || '',
    time: timeString,
    type: data.type || 'info',
    isRead: false, // Default to unread, can be managed locally if needed
    createdAt,
  };
}

/**
 * Fetch all static notifications from Firestore filtered by client code
 */
export async function fetchNotifications(): Promise<NotificationItem[]> {
  try {
    const db = getFirestore();
    const notificationsCollection = collection(db, 'staticNotifications');
    
    // Get client code from language settings
    const clientCode = getLanguageCode();
    
    // Query notifications filtered by clientCode and ordered by createdAt descending (newest first)
    // Note: This requires a composite index in Firestore: clientCode (Ascending) + createdAt (Descending)
    let snapshot;
    try {
      const notificationsQuery = query(
        notificationsCollection,
        where('clientCode', '==', clientCode),
        orderBy('createdAt', 'desc')
      );
      snapshot = await getDocs(notificationsQuery);
    } catch (indexError: any) {
      // If composite index doesn't exist, try without orderBy and sort in memory
      if (indexError?.code === 'failed-precondition' || indexError?.message?.includes('index')) {
        const fallbackQuery = query(
          notificationsCollection,
          where('clientCode', '==', clientCode)
        );
        const unsortedSnapshot = await getDocs(fallbackQuery);
        
        const notifications: NotificationItem[] = unsortedSnapshot.docs.map(convertFirestoreNotification);
        // Sort by createdAt descending
        return notifications.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      }
      throw indexError;
    }

    if (snapshot.empty) {
      return [];
    }

    const notifications: NotificationItem[] = snapshot.docs.map(convertFirestoreNotification);
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty array on error to prevent app crash
    return [];
  }
}

/**
 * Fetch notifications with error handling and retry logic
 */
export async function fetchNotificationsWithRetry(
  maxRetries: number = 2
): Promise<NotificationItem[]> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchNotifications();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  console.error('Failed to fetch notifications after retries:', lastError);
  return [];
}

