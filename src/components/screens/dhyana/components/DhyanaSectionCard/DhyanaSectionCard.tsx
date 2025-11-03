import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { styles } from './DhyanaSectionCard.styles';

interface DhyanaSectionCardProps {
  titleKey: string;
  content: string | string[];
  isList?: boolean;
  listType?: 'bullet' | 'numbered';
  variant?: 'intro' | 'default';
}

export const DhyanaSectionCard: React.FC<DhyanaSectionCardProps> = ({
  titleKey,
  content,
  isList = false,
  listType = 'bullet',
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const renderContent = () => {
    if (isList && Array.isArray(content)) {
      return (
        <ThemedView style={styles.list}>
          {content.map((item: string, index: number) => (
            <ThemedView key={index} style={styles.listItem}>
              {listType === 'bullet' ? (
                <ThemedView style={[styles.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              ) : (
                <ThemedView style={[styles.stepNumber, { backgroundColor: theme.background.quaternary }]}>
                  <ThemedLanguageText 
                    variant="primary"
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.stepNumberText}
                  >
                    {index + 1}
                  </ThemedLanguageText>
                </ThemedView>
              )}
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={listType === 'bullet' ? styles.bulletText : styles.stepText}
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
        size="medium"
        fontFamily="regional_secondary"
        style={variant === 'intro' ? styles.introText : styles.text}
      >
        {content as string}
      </ThemedLanguageText>
    );
  };

  return (
    <ThemedCard style={styles.card}>
      {variant === 'intro' ? (
        <>
          <ThemedLanguageText 
            variant="primary" 
            size="large" 
            fontFamily="regional_secondary"
            style={styles.introTitle}
          >
            {i18n.t(titleKey)}
          </ThemedLanguageText>
          {renderContent()}
        </>
      ) : (
        <>
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
          {renderContent()}
        </>
      )}
    </ThemedCard>
  );
};

