import { ProUpgradeModal } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { getBengaliTTSLanguage } from '@/utils/ttsLanguageUtils';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './SectionCard.styles';

interface SectionCardProps {
  titleKey?: string;
  content: string;
  variant?: 'intro' | 'default';
}

export const SectionCard: React.FC<SectionCardProps> = ({
  titleKey,
  content,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech({
    language: getBengaliTTSLanguage(), // Bengali language for TTS (tries bn-IN first, falls back to bn-BD or bn)
    rate: 0.85, // Slightly slower for better comprehension
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
      if (content) {
        await speak(content);
      }
    }
  };

  return (
    <ThemedCard style={variant === 'intro' ? styles.introCard : styles.card}>
      {variant === 'intro' ? (
        <ThemedView style={styles.introContainer}>
          <ThemedView style={styles.introContent}>
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.text}
            >
              {content}
            </ThemedLanguageText>
          </ThemedView>
          <TouchableOpacity
            onPress={handleSpeak}
            style={[
              styles.speakerButton,
              styles.speakerButtonIntro,
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
          )}
          <ThemedLanguageText 
            variant="primary"
            size="large"
            fontFamily="regional_secondary"
            style={styles.text}
          >
            {content}
          </ThemedLanguageText>
        </>
      )}
      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </ThemedCard>
  );
};

