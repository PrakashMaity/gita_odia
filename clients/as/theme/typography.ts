import { SIZES } from '../../../constants/sizes';

// Assamese Typography Configuration
export const assameseTypography = {
  // Font Families (using Bengali fonts as they share similar script - can be updated with Assamese-specific fonts)
  fontFamily: {
    primary: 'BegumZiaRegulaCurve',     // Bengali/Assamese share similar script
    secondary: 'MahinDhakaItalic',      // Can work for Assamese
    tertiary: 'FNMahinSameyaANSI',      // Can work for Assamese
    quaternary: 'BenSenHandwriting',    // Can work for Assamese
    english: 'SpaceMono-Regular',       // English fallback
  },
  
  // Font Sizes (Assamese script similar to Bengali, needs good readability)
  fontSize: {
    xs: SIZES.xs,                       // 12
    sm: SIZES.sm,                       // 14
    md: SIZES.md + 1,                   // 17
    lg: SIZES.lg + 1,                   // 19
    xl: SIZES.xl + 1,                   // 21
    xxl: SIZES.xxl + 1,                 // 25
    xxxl: SIZES.xxxl + 1,               // 31
    title: SIZES.title + 2,             // 36
    largeTitle: SIZES.largeTitle + 2,   // 42
    huge: SIZES.huge + 2,               // 50
    extraLargeTitle: SIZES.extraLargeTitle + 2, // 58
  },
  
  // Line Heights (similar to Bengali with vowel marks above/below)
  lineHeight: {
    xs: 16,
    sm: 19,
    md: 24,
    lg: 28,
    xl: 30,
    xxl: 33,
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
  
  // Letter Spacing (similar to Bengali)
  letterSpacing: {
    tight: -0.3,
    normal: 0.2,
    wide: 0.7,
    wider: 1.1,
    widest: 2,
  },
} as const;

