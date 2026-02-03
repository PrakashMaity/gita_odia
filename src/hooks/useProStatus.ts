import { isProActive } from '@/services/proService';
import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook to check PRO/Premium status
 * Checks free Pro status (1-day Pro)
 * 
 * @example
 * ```tsx
 * const { isPro, isLoading, refreshStatus } = useProStatus();
 * 
 * if (isPro) {
 *   // Show premium features
 * }
 * ```
 */
export const useProStatus = () => {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkProStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check free Pro status (1-day Pro)
      const hasFreePro = await isProActive();
      
      // User is Pro if free Pro is active
      setIsPro(hasFreePro);
    } catch (error) {
      console.error('[useProStatus] Error checking PRO status:', error);
      setIsPro(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check immediately on mount
    checkProStatus();

    // Refresh status periodically (every 30 seconds)
    const interval = setInterval(checkProStatus, 30000);

    // Refresh when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkProStatus();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [checkProStatus]);

  return {
    isPro,
    isLoading,
    refreshStatus: checkProStatus,
  };
};

