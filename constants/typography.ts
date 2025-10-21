import Constants from 'expo-constants';
import { assameseTypography } from '../clients/as/theme';
import { bengaliTypography } from '../clients/bn/theme';
import { englishTypography } from '../clients/en/theme';
import { hindiTypography } from '../clients/hi/theme';
import { odiaTypography } from '../clients/or/theme';

// Type for client typography configuration
export interface ClientTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    english: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    title: number;
    largeTitle: number;
    huge: number;
    extraLargeTitle: number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    title: number;
    largeTitle: number;
    huge: number;
  };
  fontWeight: {
    thin: string;
    light: string;
    normal: string;
    medium: string;
    semiBold: string;
    bold: string;
    extraBold: string;
    black: string;
  };
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
    wider: number;
    widest: number;
  };
}

// Get client-specific typography based on APP_LANG environment variable
const getClientTypography = (): ClientTypography => {
  const language = Constants.expoConfig?.extra?.LANGUAGE || 'or';
  
  switch (language) {
    case 'bn':
      return bengaliTypography;
    case 'en':
      return englishTypography;
    case 'hi':
      return hindiTypography;
    case 'as':
      return assameseTypography;
    case 'or':
    default:
      return odiaTypography;
  }
};

// Get client typography
const clientTypography = getClientTypography();

// Export typography with client-specific values
export const TYPOGRAPHY = {
  // Font Families (client-specific)
  fontFamily: {
    primary: clientTypography.fontFamily.primary,
    secondary: clientTypography.fontFamily.secondary,
    tertiary: clientTypography.fontFamily.tertiary,
    quaternary: clientTypography.fontFamily.quaternary,
    english: clientTypography.fontFamily.english,
  },
  
  // Font Sizes (client-specific, adjusted per language needs)
  fontSize: {
    xs: clientTypography.fontSize.xs,
    sm: clientTypography.fontSize.sm,
    md: clientTypography.fontSize.md,
    lg: clientTypography.fontSize.lg,
    xl: clientTypography.fontSize.xl,
    xxl: clientTypography.fontSize.xxl,
    xxxl: clientTypography.fontSize.xxxl,
    title: clientTypography.fontSize.title,
    largeTitle: clientTypography.fontSize.largeTitle,
    huge: clientTypography.fontSize.huge,
    extraLargeTitle: clientTypography.fontSize.extraLargeTitle,
  },
  
  // Line Heights (client-specific, adjusted for script requirements)
  lineHeight: {
    xs: clientTypography.lineHeight.xs,
    sm: clientTypography.lineHeight.sm,
    md: clientTypography.lineHeight.md,
    lg: clientTypography.lineHeight.lg,
    xl: clientTypography.lineHeight.xl,
    xxl: clientTypography.lineHeight.xxl,
    xxxl: clientTypography.lineHeight.xxxl,
    title: clientTypography.lineHeight.title,
    largeTitle: clientTypography.lineHeight.largeTitle,
    huge: clientTypography.lineHeight.huge,
  },
  
  // Font Weights (common across all clients)
  fontWeight: {
    thin: clientTypography.fontWeight.thin,
    light: clientTypography.fontWeight.light,
    normal: clientTypography.fontWeight.normal,
    medium: clientTypography.fontWeight.medium,
    semiBold: clientTypography.fontWeight.semiBold,
    bold: clientTypography.fontWeight.bold,
    extraBold: clientTypography.fontWeight.extraBold,
    black: clientTypography.fontWeight.black,
  },
  
  // Letter Spacing (client-specific, adjusted per script needs)
  letterSpacing: {
    tight: clientTypography.letterSpacing.tight,
    normal: clientTypography.letterSpacing.normal,
    wide: clientTypography.letterSpacing.wide,
    wider: clientTypography.letterSpacing.wider,
    widest: clientTypography.letterSpacing.widest,
  },
} as const;

// Helper function to get client language
export const getClientLanguage = (): string => {
  return Constants.expoConfig?.extra?.LANGUAGE || 'or';
};

// Export type for external use
export type Typography = typeof TYPOGRAPHY;
