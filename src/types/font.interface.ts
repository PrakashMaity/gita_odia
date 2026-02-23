import { typography as TYPOGRAPHY } from '@/rootconstants/typography';

// Font configuration type
export interface LanguageFonts {
  primary_english: string;
  regional_primary: string;
  regional_secondary: string;
}

/**
 * Get language-specific fonts from the typography configuration
 * This is the single source of truth for font names used throughout the app
 */
export const getLanguageFonts = (): LanguageFonts => {
  return {
    primary_english: TYPOGRAPHY.fontFamily.english,
    regional_primary: TYPOGRAPHY.fontFamily.primary,
    regional_secondary: TYPOGRAPHY.fontFamily.secondary,
  };
};
