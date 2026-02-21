import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import React from 'react';

export const ChaptersHeader: React.FC = () => {
  const theme = useThemeColors();

  return (
    <ScreenHeader
      title={i18n.t('chapter.chapterTitle')}
      containerStyle={{ backgroundColor: theme.background.secondary }}
     
    />
  );
};

