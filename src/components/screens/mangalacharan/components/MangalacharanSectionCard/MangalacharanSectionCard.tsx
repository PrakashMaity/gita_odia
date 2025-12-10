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
import { styles } from './MangalacharanSectionCard.styles';

interface MangalacharanSectionCardProps {
  titleKey?: string;
  content: string | string[];
  isList?: boolean;
  variant?: 'intro' | 'default';
  textStyle?: 'center' | 'left';
  isBreakdown?: boolean;
  breakdownData?: any;
}

export const MangalacharanSectionCard: React.FC<MangalacharanSectionCardProps> = ({
  titleKey,
  content,
  isList = false,
  variant = 'default',
  textStyle = 'left',
  isBreakdown = false,
  breakdownData,
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
    if (isBreakdown && breakdownData) {
      // For breakdown, combine all sections
      return Object.keys(breakdownData)
        .map((key) => {
          const section = breakdownData[key];
          return `${section.title}. ${section.mantra}. ${section.meaning}`;
        })
        .join(' ');
    }
    
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

  const handleBreakdownSectionSpeak = async (section: any) => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    const textToSpeak = `${section.title}. ${section.mantra}. ${section.meaning}`;
    if (isSpeaking) {
      await stop();
    } else {
      await speak(textToSpeak);
    }
  };

  const renderContent = () => {
    if (isBreakdown && breakdownData) {
      return (
        <ThemedView style={styles.breakdownContainer}>
          {Object.keys(breakdownData).map((key, index) => {
            const section = breakdownData[key];
            const sectionIsSpeaking = isSpeaking; // Could be enhanced to track individual sections
            return (
              <ThemedView key={key} style={[styles.breakdownSection, index > 0 && styles.breakdownSectionSpacing]}>
                <ThemedView style={styles.breakdownSectionHeader}>
                  <ThemedLanguageText 
                    variant="primary" 
                    size="large" 
                    fontFamily="regional_secondary"
                    style={styles.breakdownTitle}
                  >
                    {section.title}
                  </ThemedLanguageText>
                  <TouchableOpacity
                    onPress={() => handleBreakdownSectionSpeak(section)}
                    style={[
                      styles.speakerButton,
                      styles.speakerButtonSmall,
                      { backgroundColor: theme.background.quaternary },
                      sectionIsSpeaking && styles.speakerButtonActive,
                    ]}
                  >
                    <MaterialIcons
                      name="volume-up"
                      size={SIZES.icon.sm}
                      color={sectionIsSpeaking ? theme.status.success : theme.icon.primary}
                    />
                  </TouchableOpacity>
                </ThemedView>
                <ThemedLanguageText 
                  variant="primary" 
                  size="medium" 
                  fontFamily="regional_primary"
                  style={styles.breakdownMantra}
                >
                  {section.mantra}
                </ThemedLanguageText>
                <ThemedLanguageText 
                  variant="secondary" 
                  size="medium" 
                  fontFamily="regional_secondary"
                  style={styles.breakdownMeaning}
                >
                  {section.meaning}
                </ThemedLanguageText>
              </ThemedView>
            );
          })}
        </ThemedView>
      );
    }

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
              name={isSpeaking ? 'volume-up' : 'volume-up'}
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
                  name={isSpeaking ? 'volume-up' : 'volume-up'}
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

