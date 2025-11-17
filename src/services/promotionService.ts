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
  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
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
    const db = getFirestore();
    const promotionsCollection = collection(db, 'promotions');
    
    // Get client code from language settings
    const clientCode = getLanguageCode();
    
    // Query active promotions filtered by clientCode and isActive
    // Ordered by createdAt descending (newest first)
    let snapshot;
    try {
      const promotionsQuery = query(
        promotionsCollection,
        where('clientCode', '==', clientCode),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      snapshot = await getDocs(promotionsQuery);
    } catch (indexError: any) {
      // If composite index doesn't exist, try without orderBy and sort in memory
      if (indexError?.code === 'failed-precondition' || indexError?.message?.includes('index')) {
        const fallbackQuery = query(
          promotionsCollection,
          where('clientCode', '==', clientCode),
          where('isActive', '==', true)
        );
        const unsortedSnapshot = await getDocs(fallbackQuery);
        
        const promotions: Promotion[] = unsortedSnapshot.docs.map(convertFirestorePromotion);
        // Sort by createdAt descending
        return promotions.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      }
      throw indexError;
    }

    if (snapshot.empty) {
      return [];
    }

    const promotions: Promotion[] = snapshot.docs.map(convertFirestorePromotion);
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

