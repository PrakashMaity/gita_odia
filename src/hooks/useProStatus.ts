import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { revenueCatService } from '@/services/revenueCat/revenueCatService';

/**
 * Hook to check PRO/Premium status
 * Uses RevenueCat to check if user has active premium entitlement
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
      
      // Get customer info to ensure we have latest data
      const customerInfo = await revenueCatService.getCustomerInfo();
      
      // Check for any active entitlements
      const activeEntitlements = customerInfo.entitlements.active;
      const hasActive = Object.keys(activeEntitlements).length > 0 && 
                       Object.values(activeEntitlements).some(ent => ent.isActive);
      
      setIsPro(hasActive);
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

