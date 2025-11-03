import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import i18n from '@/i18n';
import React from 'react';
import { styles } from './ProfileHeader.styles';

export const ProfileHeader: React.FC = () => {
  return (
    <ThemedCard variant='transparent' style={styles.headerCard}>
      <ThemedView style={styles.headerContent}>
        <ThemedLanguageText
          variant="primary" 
          size="xxl" 
          fontFamily="regional_secondary"
          style={styles.title}
        >
          {i18n.t('profile.settings')}
        </ThemedLanguageText>
        <ThemedLanguageText 
          variant="secondary"
          size="medium"
          fontFamily="regional_secondary" 
          style={styles.subtitle}
        >
          {i18n.t('profile.customizeExperience')}
        </ThemedLanguageText>
      </ThemedView>
    </ThemedCard>
  );
};

