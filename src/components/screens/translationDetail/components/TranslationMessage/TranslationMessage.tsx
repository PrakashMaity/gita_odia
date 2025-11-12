import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { getSpeakerImage } from '@/utils/speakerUtils';
import i18n from '@/i18n';
import React from 'react';
import { Image } from 'react-native';
import { styles } from './TranslationMessage.styles';

type TranslationVerse = {
  id: string;
  verseNumber: string;
  speaker: string;
  speaker_english: string;
  translation: string;
};

interface TranslationMessageProps {
  verse: TranslationVerse;
  index: number;
  shouldShowBanner?: boolean;
}

export const TranslationMessage: React.FC<TranslationMessageProps> = ({
  verse,
  index,
  shouldShowBanner = false,
}) => {
  return (
    <ThemedView key={verse.id}>
      <ThemedCard style={styles.card}>
        <ThemedView style={styles.messageHeader}>
          <ThemedView style={styles.speakerInfo}>
            <Image 
              source={getSpeakerImage(verse.speaker_english)} 
              style={styles.speakerAvatar}
              resizeMode="cover"
            />
            <ThemedView style={styles.speakerDetails}>
              <ThemedLanguageText
                variant="primary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.speakerName}
              >
                {verse.speaker} || {i18n.t('verse.verse')} {verse.verseNumber}
              </ThemedLanguageText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.messageContent}>
          <ThemedLanguageText
            variant="primary"
            size="medium"
            fontFamily="regional_secondary"
            style={styles.translationText}
          >
            {verse.translation}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedCard>
    </ThemedView>
  );
};

