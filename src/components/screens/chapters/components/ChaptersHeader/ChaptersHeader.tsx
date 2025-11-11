import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { styles } from './ChaptersHeader.styles';

export const ChaptersHeader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ThemedCard variant='transparent' style={styles.headerCard}>
      <ThemedLanguageText
        variant="primary"
        size="title"
        fontFamily="regional_secondary"
        style={styles.title}
      >
        {i18n.t('chapter.chapterTitle')}
      </ThemedLanguageText>
      <ThemedView style={styles.headerActions}>
        <ThemedView style={[styles.actionButton, { borderColor: theme.border.primary }]}>
          <BookmarkIcon
            size={SIZES.icon.xl}
            focused={true}
            showBadge={true}
            badgeSize="medium"
          />
        </ThemedView>
      </ThemedView>
    </ThemedCard>
  );
};

