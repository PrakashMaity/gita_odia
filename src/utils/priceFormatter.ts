import type { PurchasesPackage } from 'react-native-purchases';

/**
 * Expected prices in INR (Indian Rupees)
 */
const EXPECTED_PRICES = {
  monthly: 5,
  quarterly: 15,
  yearly: 50,
} as const;

/**
 * Format price in Indian Rupees (₹)
 */
export const formatPriceInRupees = (amount: number): string => {
  return `₹${amount}`;
};

/**
 * Get expected price in INR based on package identifier
 */
export const getExpectedPriceInINR = (packageIdentifier: string): number | null => {
  if (packageIdentifier.includes('monthly') || packageIdentifier.includes('month')) {
    return EXPECTED_PRICES.monthly;
  }
  if (
    packageIdentifier.includes('quarterly') ||
    packageIdentifier.includes('quarter') ||
    packageIdentifier.includes('3month') ||
    packageIdentifier.includes('trimonth')
  ) {
    return EXPECTED_PRICES.quarterly;
  }
  if (
    packageIdentifier.includes('yearly') ||
    packageIdentifier.includes('year') ||
    packageIdentifier.includes('annual')
  ) {
    return EXPECTED_PRICES.yearly;
  }
  return null;
};

/**
 * Format package price for display
 * Always shows expected INR prices (₹5, ₹15, ₹50) based on package type
 */
export const formatPackagePrice = (pkg: PurchasesPackage): string => {
  const packageIdentifier = pkg.identifier.toLowerCase();
  
  // Always use expected price in INR based on package identifier
  // This ensures consistent INR pricing regardless of RevenueCat currency
  const expectedPrice = getExpectedPriceInINR(packageIdentifier);
  
  if (expectedPrice !== null) {
    // Use expected price in INR
    return formatPriceInRupees(expectedPrice);
  }
  
  // Fallback: If identifier doesn't match, log and try to use RevenueCat price
  const priceString = pkg.product.priceString || '';
  
  if (__DEV__) {
    console.warn(`[PriceFormatter] Could not map package identifier: ${pkg.identifier}, RevenueCat price: ${priceString}`);
  }
  
  // If already in INR format, return as is
  if (priceString.includes('₹') || priceString.includes('Rs') || priceString.includes('INR')) {
    return priceString;
  }
  
  // Last resort: return original price string
  return priceString;
};

/**
 * Get expected INR price based on USD amount and package type
 * Maps common USD prices to INR
 */
const getExpectedPriceFromUSD = (usdAmount: number, packageIdentifier: string): number | null => {
  // Map USD prices to expected INR prices
  // This is a fallback mapping
  if (usdAmount >= 0.05 && usdAmount <= 0.1) {
    // ~$0.06 = ₹5 monthly
    return EXPECTED_PRICES.monthly;
  }
  if (usdAmount >= 0.15 && usdAmount <= 0.2) {
    // ~$0.18 = ₹15 quarterly
    return EXPECTED_PRICES.quarterly;
  }
  if (usdAmount >= 0.5 && usdAmount <= 0.7) {
    // ~$0.60 = ₹50 yearly
    return EXPECTED_PRICES.yearly;
  }
  
  // Use identifier-based mapping as fallback
  return getExpectedPriceInINR(packageIdentifier);
};

/**
 * Format price with period for display
 */
export const formatPriceWithPeriod = (
  pkg: PurchasesPackage,
  periodTranslation: string
): string => {
  const price = formatPackagePrice(pkg);
  return `${price} ${periodTranslation}`;
};

