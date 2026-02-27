/**
 * Utility functions for bookmark-related operations
 * Follows Single Responsibility Principle - only handles bookmark utilities
 */

/**
 * Converts localized (Bengali/Odia/Hindi) numerals to English numerals
 * @param localizedNum - The localized number string
 * @returns The number in English numerals
 */
export const convertLanguageToEnglish = (localizedNum: string): string => {
  return localizedNum.replace(/[০-৯]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - '০'.charCodeAt(0) + '0'.charCodeAt(0))
  );
};

/**
 * Generates a unique bookmark ID from chapter and verse numbers
 * @param chapterNumber - Chapter number
 * @param verseNumber - Verse number
 * @returns Unique bookmark ID string
 */
export const generateBookmarkId = (chapterNumber: string, verseNumber: string): string => {
  return `${chapterNumber}-${verseNumber}`;
};

