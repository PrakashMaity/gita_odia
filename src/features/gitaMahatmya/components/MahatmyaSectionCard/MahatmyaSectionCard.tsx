import { ProUpgradeModal } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { commonStyles } from '@/constants';
import { useProStatus } from '@/hooks/useProStatus';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
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

  // Get text content for TTS
  const getTextForTTS = (): string => {
    if (isList && Array.isArray(content)) {
      return content.join('. ');
    }
    return content as string;
  };

  const handleSpeak = async () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    if (isSpeaking) {
      await stop();
    } else {
      const textToSpeak = getTextForTTS();
      if (textToSpeak) {
        await speak(textToSpeak);
      }
    }
  };

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
        <ThemedView style={styles.introContainer}>
          <ThemedView style={styles.introContent}>
            {renderContent()}
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
            <ThemedView style={commonStyles.section.sectionHeader}>
              <ThemedView style={[commonStyles.section.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText variant="primary" size="large" fontFamily="regional_secondary" style={commonStyles.section.sectionTitle}>
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
          {renderContent()}
        </>
      )}
      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </ThemedCard>
  );
};

