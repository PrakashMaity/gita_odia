import { SIZES } from './sizes';

export const TYPOGRAPHY = {
  fontSize: {
    xs: SIZES.xs,
    sm: SIZES.sm,
    md: SIZES.md,
    lg: SIZES.lg,
    xl: SIZES.xl,
    xxl: SIZES.xxl,
    xxxl: SIZES.xxxl,
    title: SIZES.title,
    largeTitle: SIZES.largeTitle,
    huge: SIZES.huge,
    extraLargeTitle: SIZES.extraLargeTitle,

  },
  
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
  
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
} as const;
