import { SIZES } from '../../../constants/sizes';

// Hindi Typography Configuration
export const hindiTypography = {
  // Font Families (using Bengali fonts as fallback for now - can be updated with Hindi-specific fonts)
  fontFamily: {
    primary: 'BegumZiaRegulaCurve',     // Fallback: Can be replaced with Devanagari font
    secondary: 'MahinDhakaItalic',      // Fallback: Can be replaced with Devanagari font
    tertiary: 'FNMahinSameyaANSI',      // Fallback: Can be replaced with Devanagari font
    quaternary: 'BenSenHandwriting',    // Fallback: Can be replaced with Devanagari font
    english: 'SpaceMono-Regular',       // English fallback
  },
  
  // Font Sizes (Devanagari script needs good readability with horizontal line)
  fontSize: {
    xs: SIZES.xs,                       // 12
    sm: SIZES.sm,                       // 14
    md: SIZES.md + 1,                   // 17
    lg: SIZES.lg + 2,                   // 20 (larger for Devanagari)
    xl: SIZES.xl + 2,                   // 22
    xxl: SIZES.xxl + 2,                 // 26
    xxxl: SIZES.xxxl + 2,               // 32
    title: SIZES.title + 3,             // 37
    largeTitle: SIZES.largeTitle + 3,   // 43
    huge: SIZES.huge + 3,               // 51
    extraLargeTitle: SIZES.extraLargeTitle + 3, // 59
  },
  
  // Line Heights (Devanagari has marks above, needs extra vertical space)
  lineHeight: {
    xs: 17,
    sm: 20,
    md: 25,
    lg: 29,
    xl: 32,
    xxl: 35,
    xxxl: 40,
    title: 44,
    largeTitle: 50,
    huge: 58,
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
  
  // Letter Spacing (Devanagari benefits from normal spacing)
  letterSpacing: {
    tight: -0.2,
    normal: 0.3,
    wide: 0.8,
    wider: 1.3,
    widest: 2.3,
  },
} as const;

