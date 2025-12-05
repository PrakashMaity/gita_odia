import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
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

