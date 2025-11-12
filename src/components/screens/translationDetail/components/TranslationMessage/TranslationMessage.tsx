import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { getSpeakerImage } from '@/utils/speakerUtils';
import i18n from '@/i18n';
import React, { useRef } from 'react';
import { Image, View } from 'react-native';
import { ShareButton } from '@/components/screens/chapterDetail/components';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
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
  chapterId?: string;
  chapterNumber?: string;
}

export const TranslationMessage: React.FC<TranslationMessageProps> = ({
  verse,
  index,
  shouldShowBanner = false,
  chapterId,
  chapterNumber,
}) => {
  const { showAlert, AlertComponent } = useCustomAlert();
  const messageCardRef = useRef<View | null>(null);
  const [hideShareButton, setHideShareButton] = React.useState(false);

  return (
    <ThemedView key={verse.id}>
      {AlertComponent}
      <View ref={messageCardRef} collapsable={false}>
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
                  {verse.speaker} • {i18n.t('verse.verse')} {verse.verseNumber}
                </ThemedLanguageText>
              </ThemedView>
            </ThemedView>
            
            {/* Share Button */}
            {chapterId && chapterNumber && !hideShareButton && (
              <ThemedView style={styles.shareButtonContainer}>
                <ShareButton
                  verseId={verse.id}
                  chapterId={chapterId}
                  chapterNumber={chapterNumber}
                  verseNumber={verse.verseNumber}
                  verseText="" // Translation-only, no original verse text
                  translation={verse.translation}
                  speaker={verse.speaker}
                  onAlert={(title, message, type) => {
                    if (type === 'success') {
                      showAlert(createSuccessAlert(title, message));
                    } else if (type === 'error') {
                      showAlert(createErrorAlert(title, message));
                    } else {
                      showAlert({ title, message });
                    }
                  }}
                  verseViewRef={messageCardRef}
                  isTranslationOnly={true}
                  onCaptureStart={() => setHideShareButton(true)}
                  onCaptureEnd={() => setHideShareButton(false)}
                />
              </ThemedView>
            )}
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
      </View>
    </ThemedView>
  );
};

