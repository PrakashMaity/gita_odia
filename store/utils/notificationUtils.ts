import { DailySloka } from '../notificationStore';

// Import all chapter data
import chapter1 from '../../Data/chapter1.json';
import chapter10 from '../../Data/chapter10.json';
import chapter11 from '../../Data/chapter11.json';
import chapter12 from '../../Data/chapter12.json';
import chapter13 from '../../Data/chapter13.json';
import chapter14 from '../../Data/chapter14.json';
import chapter15 from '../../Data/chapter15.json';
import chapter16 from '../../Data/chapter16.json';
import chapter17 from '../../Data/chapter17.json';
import chapter18 from '../../Data/chapter18.json';
import chapter2 from '../../Data/chapter2.json';
import chapter3 from '../../Data/chapter3.json';
import chapter4 from '../../Data/chapter4.json';
import chapter5 from '../../Data/chapter5.json';
import chapter6 from '../../Data/chapter6.json';
import chapter7 from '../../Data/chapter7.json';
import chapter8 from '../../Data/chapter8.json';
import chapter9 from '../../Data/chapter9.json';

interface ChapterData {
  chapter: {
    number: string;
    title: string;
    subtitle: string;
    id: string;
  };
  verses: Array<{
    verseNumber: string;
    Language: string;
    translation: string;
    speaker: string;
    id: string;
  }>;
}

const allChapters: ChapterData[] = [
  chapter1, chapter2, chapter3, chapter4, chapter5, chapter6,
  chapter7, chapter8, chapter9, chapter10, chapter11, chapter12,
  chapter13, chapter14, chapter15, chapter16, chapter17, chapter18
];

// All chapters loaded successfully

/**
 * Get all verses from all chapters
 */
export const getAllVerses = (): Array<{
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  verseNumber: string;
  Language: string;
  translation: string;
  speaker: string;
  id: string;
}> => {
  console.log('getAllVerses called, total chapters:', allChapters.length);
  console.log('First chapter data:', allChapters[0]);
  
  const allVerses: Array<{
    chapterId: string;
    chapterNumber: string;
    chapterTitle: string;
    verseNumber: string;
    Language: string;
    translation: string;
    speaker: string;
    id: string;
  }> = [];

  allChapters.forEach((chapter, index) => {
    console.log(`Processing chapter ${index + 1}:`, chapter.chapter.number, 'ID:', chapter.chapter.id);
    if (!chapter.chapter.id) {
      console.error('Chapter missing ID:', chapter.chapter);
    }
    chapter.verses.forEach((verse) => {
      allVerses.push({
        chapterId: chapter.chapter.id || 'unknown',
        chapterNumber: chapter.chapter.number,
        chapterTitle: chapter.chapter.title,
        verseNumber: verse.verseNumber,
        Language: verse.Language,
        translation: verse.translation,
        speaker: verse.speaker,
        id: verse.id,
      });
    });
  });

  console.log('Total verses processed:', allVerses.length);
  console.log('First verse data:', allVerses[0]);
  return allVerses;
};

/**
 * Get a random sloka from all chapters
 */
export const getRandomSloka = (): DailySloka => {
  // Get a random chapter first
  const randomChapterIndex = Math.floor(Math.random() * allChapters.length);
  const randomChapter = allChapters[randomChapterIndex];
  
  if (!randomChapter || !randomChapter.verses || randomChapter.verses.length === 0) {
    console.error('Invalid chapter data:', randomChapter);
    // Fallback to first chapter
    const fallbackChapter = allChapters[0];
    const fallbackVerse = fallbackChapter.verses[0];
    const today = new Date().toISOString().split('T')[0];
    
    return {
      id: fallbackVerse.id,
      chapterId: fallbackChapter.chapter.id,
      chapterNumber: fallbackChapter.chapter.number,
      verseNumber: fallbackVerse.verseNumber,
      Language: fallbackVerse.Language,
      translation: fallbackVerse.translation,
      speaker: fallbackVerse.speaker,
      date: today,
    };
  }
  
  // Get a random verse from the chapter
  const randomVerseIndex = Math.floor(Math.random() * randomChapter.verses.length);
  const randomVerse = randomChapter.verses[randomVerseIndex];
  const today = new Date().toISOString().split('T')[0];

  console.log('Selected chapter:', randomChapter.chapter.number, 'ID:', randomChapter.chapter.id);
  console.log('Selected verse:', randomVerse.verseNumber);

  return {
    id: randomVerse.id,
    chapterId: randomChapter.chapter.id,
    chapterNumber: randomChapter.chapter.number,
    verseNumber: randomVerse.verseNumber,
    Language: randomVerse.Language,
    translation: randomVerse.translation,
    speaker: randomVerse.speaker,
    date: today,
  };
};

/**
 * Get a random sloka from a specific chapter
 */
export const getRandomSlokaFromChapter = (chapterId: string): DailySloka | null => {
  const chapter = allChapters.find(ch => ch.chapter.id === chapterId);
  if (!chapter || chapter.verses.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * chapter.verses.length);
  const randomVerse = chapter.verses[randomIndex];
  const today = new Date().toISOString().split('T')[0];

  return {
    id: randomVerse.id,
    chapterId: chapter.chapter.id,
    chapterNumber: chapter.chapter.number,
    verseNumber: randomVerse.verseNumber,
    Language: randomVerse.Language,
    translation: randomVerse.translation,
    speaker: randomVerse.speaker,
    date: today,
  };
};

/**
 * Get total number of verses across all chapters
 */
export const getTotalVerseCount = (): number => {
  return allChapters.reduce((total, chapter) => total + chapter.verses.length, 0);
};

/**
 * Test function to debug chapter data
 */
export const debugChapterData = () => {
  console.log('=== DEBUGGING CHAPTER DATA ===');
  console.log('Total chapters:', allChapters.length);
  
  allChapters.forEach((chapter, index) => {
    console.log(`Chapter ${index + 1}:`, {
      number: chapter.chapter.number,
      id: chapter.chapter.id,
      title: chapter.chapter.title,
      versesCount: chapter.verses.length
    });
  });
  
  // Test getAllVerses function
  console.log('=== TESTING getAllVerses ===');
  const testVerses = getAllVerses();
  console.log('Test verses length:', testVerses.length);
  console.log('First test verse:', testVerses[0]);
  
  console.log('=== END DEBUG ===');
};
