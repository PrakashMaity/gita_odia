import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import React from 'react';
import { styles } from './ErrorState.styles';

export const ErrorState: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ThemedView variant="primary" style={styles.container}>
      <ThemedLanguageText 
        variant="error" 
        size="medium"
        fontFamily="regional_secondary"
      >
        {i18n.t('chapter.notFound')}
      </ThemedLanguageText>
    </ThemedView>
  );
};

