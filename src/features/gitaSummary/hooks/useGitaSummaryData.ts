import i18n from '@/lib/i18n';
import { useMemo } from 'react';

interface SummaryData {
  chapter: string;
  title: string;
  summary: string;
}

/**
 * Custom hook for Gita summary data
 * Follows Single Responsibility Principle - handles summary data transformation
 */
export const useGitaSummaryData = () => {
  const summaryData = useMemo(() => {
    const chapters = i18n.t('gitaSummary.chapters') as Record<string, { title: string; summary: string }>;
    return Object.keys(chapters).map((key, index) => ({
      chapter: `${index + 1}${i18n.t('verse.chapter')}`,
      title: chapters[key].title,
      summary: chapters[key].summary
    }));
  }, []);

  const teachings = useMemo(() => {
    return i18n.t('gitaSummary.teachings') as string[];
  }, []);

  return {
    summaryData,
    teachings,
  };
};

