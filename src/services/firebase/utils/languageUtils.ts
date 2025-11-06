import i18n from '@/i18n';

/**
 * Language code mapping from settings language to Firestore language codes
 */
const languageCodeMap: Record<string, string> = {
  'Language': 'bn', // Default to Bengali
  'english': 'en',
  'hindi': 'hi',
  'bengali': 'bn',
  'odia': 'or',
  'gujarati': 'gu',
  'assamese': 'as',
  'nepali': 'ne',
};

/**
 * Get current language code for Firestore
 * Falls back to i18n locale or 'bn' (Bengali) as default
 */
export const getLanguageCode = (): string => {
  try {
    // Try to get from i18n first (most reliable)
    const i18nLocale = i18n.locale;
    if (i18nLocale && i18nLocale !== 'en') {
      return i18nLocale;
    }

    // Fallback to default Bengali
    return 'bn';
  } catch (error) {
    if (__DEV__) {
      console.warn('[Language] Error getting language code, defaulting to bn:', error);
    }
    return 'bn';
  }
};

/**
 * Get language code from settings language value
 */
export const getLanguageCodeFromSettings = (settingsLanguage: string): string => {
  const normalized = settingsLanguage.toLowerCase();
  return languageCodeMap[normalized] || 'bn';
};


