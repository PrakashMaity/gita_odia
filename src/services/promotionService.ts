
export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  navigationUrl?: string;
  type: 'promotion' | 'update';
  createdAt?: number;
}


/**
 * Fetch active promotions (Mock fallback - Firebase removed)
 */
export async function fetchPromotions(): Promise<Promotion[]> {
  try {
    // Firebase implementation removed
    return [];
  } catch (error) {
    console.error('[Promotions] Error fetching promotions:', error);
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

