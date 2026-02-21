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

