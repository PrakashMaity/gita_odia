import { ProUpgradeModal } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useTheme } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { getBengaliTTSLanguage } from '@/utils/ttsLanguageUtils';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './SummaryCard.styles';

interface SummaryCardProps {
  chapter: string;
  title: string;
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  chapter,
  title,
  summary,
}) => {
  const { theme } = useTheme();
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech({
    language: getBengaliTTSLanguage(), // Bengali language for TTS (tries bn-IN first, falls back to bn-BD or bn)
    rate: 0.85,
    pitch: 1.0,
    onError: (error) => {
      if (error.message === 'PRO_REQUIRED') {
        setShowProModal(true);
      }
    },
  });

  const handleSpeak = async () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    if (isSpeaking) {
      await stop();
    } else {
      const textToSpeak = `${title}. ${summary}`;
      await speak(textToSpeak);
    }
  };

  return (
    <ThemedCard style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedView style={[styles.chapterIndicator, { backgroundColor: theme.background.quaternary }]}>
          <ThemedLanguageText 
            variant="primary"
            size="small"
            fontFamily="regional_secondary"
            style={styles.chapterNumber}
          >
            {chapter}
          </ThemedLanguageText>
        </ThemedView>
        <ThemedLanguageText 
          variant="primary" 
          size="large" 
          fontFamily="regional_secondary"
          style={styles.chapterTitle}
        >
          {title}
        </ThemedLanguageText>
        <TouchableOpacity
          onPress={handleSpeak}
          style={[
            styles.speakerButton,
            { backgroundColor: theme.background.quaternary },
            isSpeaking && styles.speakerButtonActive,
          ]}
        >
          <MaterialIcons
            name="volume-up"
            size={SIZES.icon.md}
            color={isSpeaking ? theme.status.success : theme.icon.primary}
          />
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedLanguageText 
        variant="secondary"
        size="medium"
        fontFamily="regional_secondary"
      >
        {summary}
      </ThemedLanguageText>
      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </ThemedCard>
  );
};

