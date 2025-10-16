import { bnChapters } from "@/clients/bn/data";
import { orChapters } from "@/clients/or/data";
import Constants from 'expo-constants';

const chapterImports: Record<string, any[]> = {
    bn: [...bnChapters],
    or: [...orChapters],
  };

// Get language with error handling
const getLang = () => {
  try {
    return Constants.expoConfig?.extra?.LANGUAGE || 'bn';
  } catch (error) {
    console.error('Error reading language from Constants:', error);
    return 'bn'; // Fallback to Bengali
  }
};

const lang = getLang();
export const rawChapters = chapterImports[lang] || chapterImports['bn'];
  