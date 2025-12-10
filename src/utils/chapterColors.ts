/**
 * Get chapter-based colors for modal differentiation
 * Returns different color schemes based on chapter number
 * Using more subtle, elegant colors that work well with the app theme
 */

// Color palettes for different chapters (cycling through colors)
// Using more sophisticated, harmonious color schemes
const CHAPTER_COLORS = [
  // Chapter 1-6 - Warm, spiritual tones
  { primary: '#D97757', secondary: '#E8A87C', accent: '#C45A3A', gradient: ['#D97757', '#E8A87C'] }, // Warm terracotta
  { primary: '#6B8E9F', secondary: '#8FA8B5', accent: '#4A6B7A', gradient: ['#6B8E9F', '#8FA8B5'] }, // Soft blue-gray
  { primary: '#9B7A5F', secondary: '#B8957A', accent: '#7A5F47', gradient: ['#9B7A5F', '#B8957A'] }, // Earthy brown
  { primary: '#A67C7C', secondary: '#C49A9A', accent: '#8A5F5F', gradient: ['#A67C7C', '#C49A9A'] }, // Muted rose
  { primary: '#7A8B9F', secondary: '#9AA8B8', accent: '#5A6B7F', gradient: ['#7A8B9F', '#9AA8B8'] }, // Slate blue
  { primary: '#B88A6B', secondary: '#D4A689', accent: '#9A6A4A', gradient: ['#B88A6B', '#D4A689'] }, // Golden brown
  
  // Chapter 7-12 - Cool, serene tones
  { primary: '#6B9F8F', secondary: '#8FB8A8', accent: '#4A7F6F', gradient: ['#6B9F8F', '#8FB8A8'] }, // Sage green
  { primary: '#8B7A9F', secondary: '#A89AB8', accent: '#6B5A7F', gradient: ['#8B7A9F', '#A89AB8'] }, // Lavender gray
  { primary: '#7A9F8B', secondary: '#9AB8A8', accent: '#5A7F6B', gradient: ['#7A9F8B', '#9AB8A8'] }, // Mint gray
  { primary: '#9F8B7A', secondary: '#B8A89A', accent: '#7F6B5A', gradient: ['#9F8B7A', '#B8A89A'] }, // Beige
  { primary: '#8B9F7A', secondary: '#A8B89A', accent: '#6B7F5A', gradient: ['#8B9F7A', '#A8B89A'] }, // Olive
  { primary: '#9F7A8B', secondary: '#B89AA8', accent: '#7F5A6B', gradient: ['#9F7A8B', '#B89AA8'] }, // Dusty rose
  
  // Chapter 13-18 - Rich, deep tones
  { primary: '#7A6B9F', secondary: '#9A8AB8', accent: '#5A4A7F', gradient: ['#7A6B9F', '#9A8AB8'] }, // Soft purple
  { primary: '#9F7A6B', secondary: '#B89A8A', accent: '#7F5A4A', gradient: ['#9F7A6B', '#B89A8A'] }, // Terracotta
  { primary: '#6B9F7A', secondary: '#8AB89A', accent: '#4A7F5A', gradient: ['#6B9F7A', '#8AB89A'] }, // Forest green
  { primary: '#8B6B9F', secondary: '#A88AB8', accent: '#6B4A7F', gradient: ['#8B6B9F', '#A88AB8'] }, // Plum
  { primary: '#9F8B6B', secondary: '#B8A88A', accent: '#7F6B4A', gradient: ['#9F8B6B', '#B8A88A'] }, // Khaki
  { primary: '#7A9F6B', secondary: '#9AB88A', accent: '#5A7F4A', gradient: ['#7A9F6B', '#9AB88A'] }, // Moss green
];

/**
 * Normalize chapter number from any format (Bengali, Hindi, Odia, etc.) to integer
 */
const normalizeChapterNumber = (chapterNumber: string | number | undefined): number => {
  if (typeof chapterNumber === 'number') {
    return chapterNumber;
  }

  if (!chapterNumber) {
    return 1; // Default to chapter 1
  }

  // Bengali digits
  const banglaDigits = '০১২৩৪৫৬৭৮৯';
  // Hindi digits
  const hindiDigits = '०१२३४५६७८९';
  // Odia digits
  const odiaDigits = '୦୧୨୩୪୫୬୭୮୯';
  
  let normalizedString = `${chapterNumber}`;
  
  // Replace Bengali digits
  normalizedString = normalizedString.replace(/[০-৯]/g, (digit) => {
    const index = banglaDigits.indexOf(digit);
    return index >= 0 ? `${index}` : digit;
  });
  
  // Replace Hindi digits
  normalizedString = normalizedString.replace(/[०-९]/g, (digit) => {
    const index = hindiDigits.indexOf(digit);
    return index >= 0 ? `${index}` : digit;
  });
  
  // Replace Odia digits
  normalizedString = normalizedString.replace(/[୦-୯]/g, (digit) => {
    const index = odiaDigits.indexOf(digit);
    return index >= 0 ? `${index}` : digit;
  });

  const parsed = parseInt(normalizedString, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;
};

/**
 * Get chapter-based color scheme
 * @param chapterNumber - Chapter number in any format
 * @returns Color scheme object with primary, secondary, accent, and gradient
 */
export const getChapterColors = (chapterNumber: string | number | undefined) => {
  const normalized = normalizeChapterNumber(chapterNumber);
  const colorIndex = (normalized - 1) % CHAPTER_COLORS.length;
  return CHAPTER_COLORS[colorIndex];
};

/**
 * Get verse-based color scheme (cycles through colors based on verse index)
 * @param verseIndex - Verse index (1-based)
 * @param baseChapterNumber - Optional chapter number to add variation
 * @returns Color scheme object with primary, secondary, accent, and gradient
 */
export const getVerseColors = (verseIndex: number, baseChapterNumber?: string | number) => {
  // Use verse index to cycle through colors
  // Add chapter number offset for more variation if provided
  let colorIndex = (verseIndex - 1) % CHAPTER_COLORS.length;
  
  if (baseChapterNumber) {
    const chapterOffset = normalizeChapterNumber(baseChapterNumber);
    colorIndex = (colorIndex + chapterOffset) % CHAPTER_COLORS.length;
  }
  
  return CHAPTER_COLORS[colorIndex];
};
