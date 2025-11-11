import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';

export const ProfileHeader: React.FC = () => {
  const theme = useThemeColors();

  return (
    <ScreenHeader
      title={i18n.t('profile.settings')}
      subtitle={i18n.t('profile.customizeExperience')}
      containerStyle={{ backgroundColor: theme.background.secondary }}
      titleProps={{ size: 'xxl' }}
      subtitleProps={{ size: 'medium' }}
    />
  );
};

