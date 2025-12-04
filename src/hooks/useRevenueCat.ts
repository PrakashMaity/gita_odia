import { useEffect, useState, useCallback } from 'react';
import { revenueCatService } from '@/services/revenueCat/revenueCatService';
import { PurchaseCancelledError } from '@/services/revenueCat/errors';
import type {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  PurchasesEntitlementInfo,
} from 'react-native-purchases';

interface UseRevenueCatReturn {
  // Data
  offering: PurchasesOffering | null;
  packages: PurchasesPackage[] | null;
  customerInfo: CustomerInfo | null;
  activeEntitlements: Record<string, PurchasesEntitlementInfo>;
  isPremium: boolean;
  
  // Loading states
  isLoading: boolean;
  isPurchasing: boolean;
  
  // Methods
  refreshOffering: () => Promise<void>;
  purchasePackage: (packageToPurchase: PurchasesPackage) => Promise<CustomerInfo>;
  restorePurchases: () => Promise<CustomerInfo>;
  refreshCustomerInfo: () => Promise<void>;
  checkPremiumStatus: () => Promise<void>;
}

/**
 * Hook for easy RevenueCat usage in React components
 * 
 * @example
 * ```tsx
 * const { offering, packages, isPremium, purchasePackage, isLoading } = useRevenueCat();
 * 
 * const handlePurchase = async () => {
 *   if (packages && packages[0]) {
 *     try {
 *       await purchasePackage(packages[0]);
 *       // Purchase successful
 *     } catch (error) {
 *       // Handle error
 *     }
 *   }
 * };
 * ```
 */
export const useRevenueCat = (): UseRevenueCatReturn => {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[] | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [activeEntitlements, setActiveEntitlements] = useState<Record<string, PurchasesEntitlementInfo>>({});
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Fetch offering and packages
  const refreshOffering = useCallback(async () => {
    try {
      const currentOffering = await revenueCatService.getOfferings();
      setOffering(currentOffering);
      setPackages(currentOffering?.availablePackages || null);
    } catch (error) {
      console.error('Error refreshing offering:', error);
      setOffering(null);
      setPackages(null);
    }
  }, []);

  // Fetch customer info
  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
      
      const entitlements = await revenueCatService.getActiveEntitlements();
      setActiveEntitlements(entitlements);
      
      const premiumStatus = await revenueCatService.isPremium();
      setIsPremium(premiumStatus);
    } catch (error) {
      console.error('Error refreshing customer info:', error);
    }
  }, []);

  // Check premium status
  const checkPremiumStatus = useCallback(async () => {
    const premiumStatus = await revenueCatService.isPremium();
    setIsPremium(premiumStatus);
  }, []);

  // Purchase a package
  const purchasePackage = useCallback(async (packageToPurchase: PurchasesPackage): Promise<CustomerInfo> => {
    setIsPurchasing(true);
    try {
      const info = await revenueCatService.purchasePackage(packageToPurchase);
      await refreshCustomerInfo(); // Refresh after purchase
      return info;
    } catch (error: any) {
      // Re-throw the error - let the UI handle it
      // Custom error classes will allow UI to distinguish between cancellations and real errors
      throw error;
    } finally {
      setIsPurchasing(false);
    }
  }, [refreshCustomerInfo]);

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<CustomerInfo> => {
    setIsLoading(true);
    try {
      const info = await revenueCatService.restorePurchases();
      await refreshCustomerInfo(); // Refresh after restore
      return info;
    } catch (error) {
      console.error('Restore error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfo]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          refreshOffering(),
          refreshCustomerInfo(),
        ]);
      } catch (error) {
        console.error('Error loading RevenueCat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [refreshOffering, refreshCustomerInfo]);

  return {
    // Data
    offering,
    packages,
    customerInfo,
    activeEntitlements,
    isPremium,
    
    // Loading states
    isLoading,
    isPurchasing,
    
    // Methods
    refreshOffering,
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
    checkPremiumStatus,
  };
};

