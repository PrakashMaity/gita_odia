import { SIZES } from '../../../constants/sizes';

// English Typography Configuration
export const englishTypography = {
  // Font Families
  fontFamily: {
    primary: 'SpaceMono-Regular',       // Monospace font for English
    secondary: 'System',                // System default
    tertiary: 'System',                 // System default
    quaternary: 'System',               // System default
    english: 'SpaceMono-Regular',       // English main font
  },
  
  // Font Sizes (English can use standard sizes)
  fontSize: {
    xs: SIZES.xs,                       // 12
    sm: SIZES.sm,                       // 14
    md: SIZES.md,                       // 16
    lg: SIZES.lg,                       // 18
    xl: SIZES.xl,                       // 20
    xxl: SIZES.xxl,                     // 24
    xxxl: SIZES.xxxl,                   // 30
    title: SIZES.title,                 // 34
    largeTitle: SIZES.largeTitle,       // 40
    huge: SIZES.huge,                   // 48
    extraLargeTitle: SIZES.extraLargeTitle, // 56
  },
  
  // Line Heights (standard English line heights)
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 26,
    xxl: 28,
    xxxl: 32,
    title: 36,
    largeTitle: 40,
    huge: 44,
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
  
  // Letter Spacing (English standard spacing)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
} as const;

