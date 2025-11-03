import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { TranslationData } from '@/store';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './TranslationCard.styles';

interface TranslationCardProps {
  translation: TranslationData;
  onPress: (chapterId: string) => void;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  translation,
  onPress,
}) => {
  const { theme } = useTheme();
  const { chapter } = translation;

  return (
    <TouchableOpacity
      key={chapter.id}
      onPress={() => onPress(chapter.id)}
      style={styles.container}
    >
      <ThemedCard style={styles.card} pattern='mandala' patternOpacity={0.05}>
        <ThemedView style={styles.content}>
          <ThemedView style={[styles.iconContainer, {
            backgroundColor: theme.background.tertiary,
          }]}>
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.chapterNumber}
            >
              {chapter.number}
            </ThemedLanguageText>
          </ThemedView>

          <ThemedView style={styles.textContainer}>
            {chapter.subtitle && chapter.subtitle !== chapter.title && (
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.subtitle}
                numberOfLines={1}
              >
                {chapter.subtitle}
              </ThemedLanguageText>
            )}

            <ThemedView style={styles.info}>
              <ThemedLanguageText
                variant="secondary"
                size="small"
                fontFamily="regional_secondary"
                style={styles.verseCount}
              >
                {chapter.totalVerses} {i18n.t('verse.translation')}
              </ThemedLanguageText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.quaternary }]}>
            <MaterialIcons
              name="arrow-forward-ios"
              size={SIZES.icon.xs}
              color={theme.icon.quaternary}
            />
          </ThemedView>
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );
};

