export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
  package: any;
  pricePerMonth: number;
  pricePerYear: number;
  packageType: PackageType;
}

export type PackageType =
  | 'MONTHLY'
  | 'THREE_MONTH'
  | 'SIX_MONTH'
  | 'ANNUAL'
  | 'LIFETIME'
  | 'WEEKLY'
  | 'TWO_MONTH';

export const PACKAGE_TYPE_ORDER: PackageType[] = [
  'MONTHLY',
  'TWO_MONTH',
  'THREE_MONTH',
  'SIX_MONTH',
  'ANNUAL',
  'LIFETIME',
  'WEEKLY',
];

export const getPackageDisplayName = (packageType: PackageType): string => {
  const names: Record<PackageType, string> = {
    MONTHLY: 'Monthly',
    TWO_MONTH: '2 Months',
    THREE_MONTH: 'Quarterly',
    SIX_MONTH: '6 Months',
    ANNUAL: 'Annual',
    LIFETIME: 'Lifetime',
    WEEKLY: 'Weekly',
  };
  return names[packageType] || packageType;
};

export const getPeriodText = (
  packageType: PackageType,
  product: any
): string => {
  if (packageType === 'LIFETIME') return 'one-time payment';
  if (packageType === 'MONTHLY') return 'per month';
  if (packageType === 'TWO_MONTH') return 'per 2 months';
  if (packageType === 'THREE_MONTH') return 'per 3 months';
  if (packageType === 'SIX_MONTH') return 'per 6 months';
  if (packageType === 'ANNUAL') return 'per year';
  if (packageType === 'WEEKLY') return 'per week';

  if (product?.subscriptionPeriod) {
    const period = product.subscriptionPeriod;
    if (period === 'P1M') return 'per month';
    if (period === 'P3M') return 'per 3 months';
    if (period === 'P6M') return 'per 6 months';
    if (period === 'P1Y') return 'per year';
    if (period === 'P1W') return 'per week';
  }

  return 'per billing period';
};

export interface SubscriptionDetailsDisplay {
  status: 'active' | 'expired' | 'none';
  entitlementId: string;
  productIdentifier: string;
  planName: string;
  expirationDate: string | null;
  purchaseDate: string | null;
  isLifetime: boolean;
  willRenew: boolean;
}
