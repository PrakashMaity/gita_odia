import { TYPOGRAPHY } from '@/constants/typography';

export type TextVariant = 'primary' | 'secondary' | 'disabled' | 'error' | 'success' | 'warning';
export type TextSize = keyof typeof TYPOGRAPHY.fontSize;
