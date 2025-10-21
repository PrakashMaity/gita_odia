import { SIZES } from '../../../constants/sizes';

// Odia Typography Configuration
export const odiaTypography = {
  // Font Families
  fontFamily: {
    primary: 'NotoSansOriya',           // Clean, modern sans-serif for body text
    secondary: 'NotoSerifOriya2',       // Traditional serif for headings
    tertiary: 'AnekOdia',               // Decorative for special text
    quaternary: 'BalooBhaina2',         // Rounded, friendly for UI elements
    english: 'SpaceMono-Regular',       // English fallback
  },
  
  // Font Sizes (Odia script may need slightly larger sizes for readability)
  fontSize: {
    xs: SIZES.xs,                       // 12
    sm: SIZES.sm,                       // 14
    md: SIZES.md + 1,                   // 17 (slightly larger for Odia script)
    lg: SIZES.lg + 1,                   // 19
    xl: SIZES.xl + 1,                   // 21
    xxl: SIZES.xxl + 2,                 // 26
    xxxl: SIZES.xxxl + 2,               // 32
    title: SIZES.title + 2,             // 36
    largeTitle: SIZES.largeTitle + 2,   // 42
    huge: SIZES.huge + 2,               // 50
    extraLargeTitle: SIZES.extraLargeTitle + 2, // 58
  },
  
  // Line Heights (adjusted for Odia script's vertical spacing needs)
  lineHeight: {
    xs: 16,
    sm: 18,
    md: 24,
    lg: 28,
    xl: 30,
    xxl: 34,
    xxxl: 38,
    title: 42,
    largeTitle: 48,
    huge: 56,
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },
  
  // Letter Spacing (Odia benefits from slightly wider spacing)
  letterSpacing: {
    tight: -0.3,
    normal: 0.2,
    wide: 0.8,
    wider: 1.2,
    widest: 2.2,
  },
} as const;

