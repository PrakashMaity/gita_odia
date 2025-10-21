import { SIZES } from '../../../constants/sizes';

// Bengali Typography Configuration
export const bengaliTypography = {
  // Font Families
  fontFamily: {
    primary: 'BegumZiaRegulaCurve',     // Elegant curved Bengali font for body
    secondary: 'MahinDhakaItalic',      // Italic style for emphasis
    tertiary: 'FNMahinSameyaANSI',      // Traditional Bengali for headings
    quaternary: 'BenSenHandwriting',    // Handwritten style for special text
    english: 'SpaceMono-Regular',       // English fallback
  },
  
  // Font Sizes (Bengali script needs good readability)
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
  
  // Line Heights (Bengali has vowel marks above/below, needs extra space)
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
  
  // Letter Spacing (Bengali benefits from normal to slightly wider spacing)
  letterSpacing: {
    tight: -0.3,
    normal: 0.2,
    wide: 0.7,
    wider: 1.1,
    widest: 2,
  },
} as const;

