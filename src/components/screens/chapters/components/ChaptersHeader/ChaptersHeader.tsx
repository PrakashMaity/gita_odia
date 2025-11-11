import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { styles } from './ChaptersHeader.styles';

export const ChaptersHeader: React.FC = () => {
  const theme = useThemeColors();

  return (
    <ScreenHeader
      title={i18n.t('chapter.chapterTitle')}
      containerStyle={{ backgroundColor: theme.background.secondary }}
      rightContent={
        <ThemedView style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}>
          <BookmarkIcon
            size={SIZES.icon.md}
            focused={true}
            showBadge={true}
            badgeSize="medium"
          />
        </ThemedView>
      }
    />
  );
};

