import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { commonStyles } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { styles } from './MahatmyaSectionCard.styles';

interface MahatmyaSectionCardProps {
  titleKey?: string;
  content: string | string[];
  isList?: boolean;
  variant?: 'intro' | 'default';
  textStyle?: 'center' | 'left';
}

export const MahatmyaSectionCard: React.FC<MahatmyaSectionCardProps> = ({
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
        <ThemedView style={commonStyles.listItem.list}>
          {content.map((item: string, index: number) => (
            <ThemedView key={index} style={commonStyles.listItem.listItem}>
              <ThemedView style={[commonStyles.listItem.bulletPoint, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText variant="secondary" size="medium" fontFamily="regional_secondary" style={commonStyles.listItem.itemText}>
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
    <ThemedCard style={variant === 'intro' ? commonStyles.card.introCard : commonStyles.card.card}>
      {variant === 'intro' ? (
        renderContent()
      ) : (
        <>
          {titleKey && (
            <ThemedView style={commonStyles.section.sectionHeader}>
              <ThemedView style={[commonStyles.section.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText variant="primary" size="large" fontFamily="regional_secondary" style={commonStyles.section.sectionTitle}>
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

