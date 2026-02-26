/**
 * Locale mapping for date formatting
 * Maps language codes to locale strings for proper date localization
 */
const localeMap: Record<string, string> = {
  bn: 'bn-BD',  // Bengali (Bangladesh)
  or: 'or-IN',  // Odia (India)
  hi: 'hi-IN',  // Hindi (India)
  as: 'as-IN',  // Assamese (India)
  en: 'en-US',  // English (United States)
  gu: 'gu-IN',  // Gujarati (India)
  ne: 'ne-NP',  // Nepali (Nepal)
};

/**
 * Gets the current language code
 */
const getCurrentLanguage = (): string => {
  return 'bn';
};

/**
 * Gets the locale string for the current language or falls back to English
 */
export const getLocale = (): string => {
  return 'en-US';
};

/**
 * Formats a timestamp to a localized date string
 * @param timestamp - Unix timestamp in milliseconds
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @returns Formatted date string in the appropriate locale
 */
export const formatDate = (
  timestamp: number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const date = new Date(timestamp);
  const locale = getLocale();
  return date.toLocaleDateString(locale, options);
};

/**
 * Formats a date to show last read date (short format)
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string in short format
 */
export const formatLastReadDate = (timestamp: number): string => {
  return formatDate(timestamp, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date to show full date (long format)
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string in long format
 */
export const formatFullDate = (timestamp: number): string => {
  return formatDate(timestamp, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

