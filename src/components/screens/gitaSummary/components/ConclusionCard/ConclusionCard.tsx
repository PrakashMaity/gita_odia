import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { styles } from './ConclusionCard.styles';

interface ConclusionCardProps {
  titleKey: string;
  teachings: string[];
}

export const ConclusionCard: React.FC<ConclusionCardProps> = ({
  titleKey,
  teachings,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedCard style={styles.card}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
        <ThemedLanguageText 
          variant="primary" 
          size="xl" 
          fontFamily="regional_secondary"
          style={styles.sectionTitle}
        >
          {i18n.t(titleKey)}
        </ThemedLanguageText>
      </ThemedView>
      
      <ThemedView style={styles.teachingsList}>
        {teachings.map((teaching: string, index: number) => (
          <ThemedView key={index} style={styles.teachingItem}>
            <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText 
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.teachingText}
            >
              {teaching}
            </ThemedLanguageText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedCard>
  );
};

