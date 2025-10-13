import { DailySloka } from '../notificationStore';

// Import all chapter data
import { rawChapters } from '@/Data';

interface ChapterData {
  chapter: {
    number: string;
    title: string;
    subtitle: string;
    id: string;
  };
  verses: {
    verseNumber: string;
    Language: string;
    translation: string;
    speaker: string;
    id: string;
  }[];
}

const allChapters: ChapterData[] = [...rawChapters];

// All chapters loaded successfully

/**
 * Get all verses from all chapters
 */
export const getAllVerses = (): {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  verseNumber: string;
  Language: string;
  translation: string;
  speaker: string;
  id: string;
}[] => {
  
  const allVerses: {
    chapterId: string;
    chapterNumber: string;
    chapterTitle: string;
    verseNumber: string;
    Language: string;
    translation: string;
    speaker: string;
    id: string;
  }[] = [];

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
