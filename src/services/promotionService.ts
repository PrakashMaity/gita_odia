import firestore from '@react-native-firebase/firestore';
import { getLanguageCode } from './firebase/utils/languageUtils';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  navigationUrl?: string;
  type: 'promotion' | 'update';
  createdAt?: number;
}

export interface FirestorePromotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  navigationUrl?: string;
  type: 'promotion' | 'update';
  isActive: boolean;
  clientCode: string;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

/**
 * Convert Firestore promotion to app promotion item
 */
function convertFirestorePromotion(
  doc: firestore.QueryDocumentSnapshot<firestore.DocumentData>
): Promotion {
  const data = doc.data() as FirestorePromotion;
  const createdAt = data.createdAt?.toMillis?.() || Date.now();

  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    imageUrl: data.imageUrl || undefined,
    navigationUrl: data.navigationUrl || undefined,
    type: data.type || 'promotion',
    createdAt,
  };
}

/**
 * Fetch active promotions from Firestore filtered by client code
 */
export async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const db = firestore();
    const promotionsCollection = db.collection('promotions');
    
    // Get client code from language settings
    const clientCode = getLanguageCode();
    console.log('[Promotions] Fetching promotions for client code:', clientCode);
    
    // Query active promotions filtered by clientCode and isActive
    // Ordered by createdAt descending (newest first)
    let snapshot;
    try {
      snapshot = await promotionsCollection
        .where('clientCode', '==', clientCode)
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .get();
    } catch (indexError: any) {
      // If composite index doesn't exist, try without orderBy and sort in memory
      if (indexError?.code === 'failed-precondition' || indexError?.message?.includes('index')) {
        console.warn('[Promotions] Firestore composite index not found, fetching without orderBy and sorting in memory');
        const unsortedSnapshot = await promotionsCollection
          .where('clientCode', '==', clientCode)
          .where('isActive', '==', true)
          .get();
        
        const promotions = unsortedSnapshot.docs.map(convertFirestorePromotion);
        console.log('[Promotions] Found', promotions.length, 'promotions (unsorted)');
        // Sort by createdAt descending
        return promotions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
      throw indexError;
    }

    if (snapshot.empty) {
      console.log('[Promotions] No promotions found for client code:', clientCode);
      return [];
    }

    const promotions = snapshot.docs.map(convertFirestorePromotion);
    console.log('[Promotions] Successfully fetched', promotions.length, 'promotions');
    return promotions;
  } catch (error) {
    console.error('[Promotions] Error fetching promotions:', error);
    // Return empty array on error to prevent app crash
    return [];
  }
}

/**
 * Fetch promotions with error handling and retry logic
 */
export async function fetchPromotionsWithRetry(
  maxRetries: number = 2
): Promise<Promotion[]> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchPromotions();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  console.error('Failed to fetch promotions after retries:', lastError);
  return [];
}

