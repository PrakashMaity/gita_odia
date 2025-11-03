import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { styles } from './MangalacharanSectionCard.styles';

interface MangalacharanSectionCardProps {
  titleKey?: string;
  content: string | string[];
  isList?: boolean;
  variant?: 'intro' | 'default';
  textStyle?: 'center' | 'left';
}

export const MangalacharanSectionCard: React.FC<MangalacharanSectionCardProps> = ({
  titleKey,
  content,
  isList = false,
  variant = 'default',
  textStyle = 'left',
}) => {
  const { theme } = useTheme();

  const renderContent = () => {
    if (isList && Array.isArray(content)) {
      return (
        <ThemedView style={styles.list}>
          {content.map((item: string, index: number) => (
            <ThemedView key={index} style={styles.listItem}>
              <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.itemText}
              >
                {item}
              </ThemedLanguageText>
            </ThemedView>
          ))}
        </ThemedView>
      );
    }

    return (
      <ThemedLanguageText 
        variant={variant === 'intro' ? 'secondary' : 'primary'}
        size={variant === 'intro' ? 'medium' : 'large'}
        fontFamily="regional_secondary"
        style={textStyle === 'center' ? styles.centeredText : styles.text}
      >
        {content as string}
      </ThemedLanguageText>
    );
  };

  return (
    <ThemedCard style={variant === 'intro' ? styles.introCard : styles.card}>
      {variant === 'intro' ? (
        renderContent()
      ) : (
        <>
          {titleKey && (
            <ThemedView style={styles.sectionHeader}>
              <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="primary" 
                size="large" 
                fontFamily="regional_secondary"
                style={styles.sectionTitle}
              >
                {i18n.t(titleKey)}
              </ThemedLanguageText>
            </ThemedView>
          )}
          {renderContent()}
        </>
      )}
    </ThemedCard>
  );
};

