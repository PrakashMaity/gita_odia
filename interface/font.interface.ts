import { TYPOGRAPHY } from '../constants/typography';

// Font configuration type
export interface LanguageFonts {
  primary_english: string;
  regional_primary: string;
  regional_secondary: string;
  regional_tertiary: string;
  regional_quaternary: string;
}

// Get language-specific fonts from the typography configuration
export const getLanguageFonts = (): LanguageFonts => {
  return {
    primary_english: TYPOGRAPHY.fontFamily.english,
    regional_primary: TYPOGRAPHY.fontFamily.primary,
    regional_secondary: TYPOGRAPHY.fontFamily.secondary,
    regional_tertiary: TYPOGRAPHY.fontFamily.tertiary,
    regional_quaternary: TYPOGRAPHY.fontFamily.quaternary,
  };
};

// Export for backward compatibility
export const FONTS_LANGUAGE = getLanguageFonts();

// Legacy font constants (kept for backward compatibility)
export const FONTS_ENGLISH = {
  en_primary: 'SpaceMono-Regular',
};

export const FONTS_BENGALI = {
  primary_english: 'SpaceMono-Regular',
  regional_primary: 'BegumZiaRegulaCurve',
  regional_secondary: 'MahinDhakaItalic',
  regional_tertiary: 'FNMahinSameyaANSI',
  regional_quaternary: 'BenSenHandwriting',
};

export const FONTS_ODIA = {
  primary_english: 'SpaceMono-Regular',
  regional_primary: 'NotoSansOriya',
  regional_secondary: 'NotoSerifOriya2',
  regional_tertiary: 'AnekOdia',
  regional_quaternary: 'BalooBhaina2',
};

export const FONTS_HINDI = FONTS_BENGALI;
export const FONTS_ASSAMESE = FONTS_BENGALI;
