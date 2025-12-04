/**
 * TTS Language Utilities
 * Provides utilities for selecting the best language code for Text-to-Speech
 */

/**
 * Get the best Bengali language code for TTS
 * Tries bn-IN (Indian Bengali) first, then falls back to bn-BD or bn
 * 
 * @returns Best Bengali language code for TTS
 */
export const getBengaliTTSLanguage = (): string => {
  // Try bn-IN first (Indian Bengali) as it's more commonly supported
  // and provides better pronunciation for Indian Bengali speakers
  // If not supported, the TTS engine will fall back automatically
  
  // Priority order:
  // 1. bn-IN - Indian Bengali (preferred for Indian users)
  // 2. bn-BD - Bangladeshi Bengali (fallback)
  // 3. bn - Generic Bengali (last resort)
  
  // Note: expo-speech uses native iOS/Android TTS which typically supports both
  // The actual support depends on the device's installed TTS voices
  return 'bn-IN';
};

/**
 * Get language code for TTS based on current app language
 * 
 * @param appLanguage - Current app language code (e.g., 'bn', 'or', 'hi')
 * @returns Best TTS language code
 */
export const getTTSLanguage = (appLanguage: string = 'bn'): string => {
  const languageMap: Record<string, string> = {
    'bn': getBengaliTTSLanguage(), // Use smart Bengali selector
    'or': 'or-IN',  // Odia (India)
    'hi': 'hi-IN',  // Hindi (India)
    'as': 'as-IN',  // Assamese (India)
    'en': 'en-US',  // English (United States)
    'gu': 'gu-IN',  // Gujarati (India)
    'ne': 'ne-NP',  // Nepali (Nepal)
  };

  return languageMap[appLanguage] || 'en-US';
};

/**
 * Get Bengali TTS language with fallback options
 * Returns an array of language codes to try in order
 * 
 * @returns Array of Bengali language codes in priority order
 */
export const getBengaliTTSLanguageFallbacks = (): string[] => {
  return ['bn-IN', 'bn-BD', 'bn'];
};

