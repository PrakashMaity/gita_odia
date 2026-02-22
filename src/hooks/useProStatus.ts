import { useProStore } from '@/store/proStore';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook to check PRO/Premium status
 * Uses global proStore for synchronized state across the app
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
  const { isPro, isLoading, refreshProStatus } = useProStore();

  useEffect(() => {
    // Initial check on mount
    refreshProStatus();

    // Refresh status periodically (every 60 seconds)
    const interval = setInterval(refreshProStatus, 60000);

    // Refresh when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refreshProStatus();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [refreshProStatus]);

  return {
    isPro,
    isLoading,
    refreshStatus: refreshProStatus,
  };
};

