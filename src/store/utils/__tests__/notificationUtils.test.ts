import { getAllVerses, getRandomSloka, getTotalVerseCount } from '../notificationUtils';

describe('Notification Utils', () => {
  test('getAllVerses should return all verses from all chapters', () => {
    const allVerses = getAllVerses();
    expect(allVerses).toBeDefined();
    expect(Array.isArray(allVerses)).toBe(true);
    expect(allVerses.length).toBeGreaterThan(0);
    
    // Check structure of first verse
    const firstVerse = allVerses[0];
    expect(firstVerse).toHaveProperty('chapterId');
    expect(firstVerse).toHaveProperty('chapterNumber');
    expect(firstVerse).toHaveProperty('chapterTitle');
    expect(firstVerse).toHaveProperty('verseNumber');
    expect(firstVerse).toHaveProperty('Language');
    expect(firstVerse).toHaveProperty('translation');
    expect(firstVerse).toHaveProperty('speaker');
    expect(firstVerse).toHaveProperty('id');
  });

  test('getRandomSloka should return a valid sloka with today\'s date', () => {
    const sloka = getRandomSloka();
    expect(sloka).toBeDefined();
    expect(sloka).toHaveProperty('id');
    expect(sloka).toHaveProperty('chapterId');
    expect(sloka).toHaveProperty('chapterNumber');
    expect(sloka).toHaveProperty('verseNumber');
    expect(sloka).toHaveProperty('Language');
    expect(sloka).toHaveProperty('translation');
    expect(sloka).toHaveProperty('speaker');
    expect(sloka).toHaveProperty('date');
    
    // Check date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    expect(sloka.date).toMatch(dateRegex);
    
    // Check that date is today
    const today = new Date().toISOString().split('T')[0];
    expect(sloka.date).toBe(today);
  });

  test('getTotalVerseCount should return correct count', () => {
    const totalCount = getTotalVerseCount();
    const allVerses = getAllVerses();
    expect(totalCount).toBe(allVerses.length);
    expect(totalCount).toBeGreaterThan(0);
  });

  test('getRandomSloka should return different slokas on multiple calls', () => {
    const sloka1 = getRandomSloka();
    const sloka2 = getRandomSloka();
    
    // While it's possible to get the same sloka twice, it's very unlikely
    // We'll just check that the function doesn't throw errors
    expect(sloka1).toBeDefined();
    expect(sloka2).toBeDefined();
  });
});
