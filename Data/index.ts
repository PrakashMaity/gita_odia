import { bnChapters } from "@/clients/bn/data";
import { orChapters } from "@/clients/or/data";
import Constants from 'expo-constants';

const chapterImports: Record<string, any[]> = {
    bn: [...bnChapters],
    or: [...orChapters],
  };

  const lang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';
  export const rawChapters = chapterImports[lang] || chapterImports['bn'];
  