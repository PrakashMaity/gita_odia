import { Platform } from 'react-native';
import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PurchasesEntitlementInfo,
    PurchasesOffering,
    PurchasesPackage
} from 'react-native-purchases';
import { REVENUECAT_CONFIG } from './config';
import { PurchaseCancelledError, PurchaseError, PurchaseTestFailureError } from './errors';

/**
 * RevenueCat Service
 * Handles in-app purchases and subscriptions via RevenueCat
 */
class RevenueCatService {
  private isInitialized = false;

  /**
   * Initialize RevenueCat SDK
   * Call this once when the app starts
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    try {
      // Set log level - use VERBOSE for debugging, ERROR for production
      Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.VERBOSE : LOG_LEVEL.ERROR);

      // Configure with platform-specific API keys
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: REVENUECAT_CONFIG.iosApiKey });
      } else if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: REVENUECAT_CONFIG.androidApiKey });
      } else {
        console.warn('RevenueCat is not supported on this platform');
        return;
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Get available offerings (products and packages)
   */
  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  }

  /**
   * Get all available packages for the current offering
   */
  async getPackages(): Promise<PurchasesPackage[] | null> {
    try {
      const offering = await this.getOfferings();
      return offering?.availablePackages || null;
    } catch (error) {
      console.error('Error fetching packages:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    } catch (error: any) {
      const errorMessage = error.message || error.toString() || '';
      
      // Check if user cancelled - this is expected behavior, not an error
      if (error.userCancelled) {
        throw new PurchaseCancelledError('Purchase was cancelled');
      }
      
      // Check if this is a test store simulated failure
      if (
        errorMessage.toLowerCase().includes('test store') ||
        errorMessage.toLowerCase().includes('simulated') ||
        errorMessage.toLowerCase().includes('simulation')
      ) {
        throw new PurchaseTestFailureError(errorMessage);
      }
      
      // Log actual errors
      console.error('[RevenueCat] Purchase error:', error);
      throw new PurchaseError(
        error.message || 'Purchase failed',
        error
      );
    }
  }

  /**
   * Restore purchases (for users who reinstalled the app)
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  /**
   * Get current customer info (subscription status, entitlements, etc.)
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error fetching customer info:', error);
      throw error;
    }
  }

  /**
   * Check if user has active entitlement
   */
  async hasActiveEntitlement(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active[entitlementId] !== undefined;
    } catch (error) {
      console.error('Error checking entitlement:', error);
      return false;
    }
  }

  /**
   * Get active entitlements
   */
  async getActiveEntitlements(): Promise<Record<string, PurchasesEntitlementInfo>> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active;
    } catch (error) {
      console.error('Error fetching active entitlements:', error);
      return {};
    }
  }

  /**
   * Check if user is a premium subscriber
   * Checks for any active entitlement (more flexible than checking for specific ID)
   * Also checks for 'premium' entitlement as fallback
   */
  async isPremium(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const activeEntitlements = customerInfo.entitlements.active;
      
      // If there are any active entitlements, user is premium
      const hasAnyActiveEntitlement = Object.keys(activeEntitlements).length > 0;
      
      if (hasAnyActiveEntitlement) {
        // Check if at least one entitlement is active
        const hasActive = Object.values(activeEntitlements).some(
          entitlement => entitlement.isActive
        );
        return hasActive;
      }
      
      // Fallback: Check for specific 'premium' entitlement
      return this.hasActiveEntitlement('premium');
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Set user ID for RevenueCat
   * Useful for identifying users across devices
   */
  async setUserId(userId: string): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      await Purchases.logIn(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
      throw error;
    }
  }

  /**
   * Log out current user
   */
  async logOut(): Promise<void> {
    try {
      if (!this.isInitialized) {
        return;
      }

      await Purchases.logOut();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  /**
   * Get subscription management URL
   * Opens the platform's subscription management page (App Store/Play Store)
   */
  async getManagementURL(): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const customerInfo = await this.getCustomerInfo();
      return customerInfo.managementURL || null;
    } catch (error) {
      console.error('Error getting management URL:', error);
      return null;
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();

