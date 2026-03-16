
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'update' | 'promotion' | 'reminder' | 'info';
  isRead: boolean;
  createdAt?: number;
}


/**
 * Fetch all static notifications (Mock fallback - Firebase removed)
 */
export async function fetchNotifications(): Promise<NotificationItem[]> {
  try {
    // Firebase implementation removed
    return [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
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

