import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { styles } from './SummaryCard.styles';

interface SummaryCardProps {
  chapter: string;
  title: string;
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  chapter,
  title,
  summary,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedCard style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedView style={[styles.chapterIndicator, { backgroundColor: theme.background.quaternary }]}>
          <ThemedLanguageText 
            variant="primary"
            size="small"
            fontFamily="regional_secondary"
            style={styles.chapterNumber}
          >
            {chapter}
          </ThemedLanguageText>
        </ThemedView>
        <ThemedLanguageText 
          variant="primary" 
          size="large" 
          fontFamily="regional_secondary"
          style={styles.chapterTitle}
        >
          {title}
        </ThemedLanguageText>
      </ThemedView>
      
      <ThemedLanguageText 
        variant="secondary"
        size="medium"
        fontFamily="regional_secondary"
      >
        {summary}
      </ThemedLanguageText>
    </ThemedCard>
  );
};

