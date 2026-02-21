import { SectionCard } from '@/features/gitaSummary/components/SectionCard';
import { PageHeader } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useVerseOfTheDayStore } from '@/store/verseOfTheDayStore';
import { LayoutImages } from '@/lib/utils/assets';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ImageBackground, ScrollView, Share, TouchableOpacity, View } from 'react-native';
import { styles } from './VerseOfTheDayScreen.styles';

export const VerseOfTheDayScreen: React.FC = () => {
  const { loadVerseOfTheDay, getTodaysVerse, shareVerse, isLoading } = useVerseOfTheDayStore();
  const theme = useThemeColors();
  const verse = getTodaysVerse();
  const { speak, stop, isSpeaking } = useTextToSpeech({
    language: getBengaliTTSLanguage(), // Bengali language for TTS (tries bn-IN first, falls back to bn-BD or bn)
    rate: 0.85,
    pitch: 1.0,
  });

  useEffect(() => {
    loadVerseOfTheDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    const shareText = shareVerse();
    if (shareText) {
      try {
        await Share.share({
          message: shareText,
          title: i18n.t('verseOfTheDay.shareTitle'),
        });
      } catch (error) {
        console.error('Error sharing verse:', error);
      }
    }
  };

  const handleViewChapter = () => {
    if (verse) {
      router.push(`/chapter/${verse.chapterId}`);
    }
  };

  const handleSpeakVerse = async () => {
    if (!verse) return;
    
    if (isSpeaking) {
      await stop();
    } else {
      try {
        // Read Bengali translation first (TTS works better with Bengali)
        const translation = verse.translation || '';
        const textToSpeak = `${verse.chapterNumber || ''} অধ্যায়, ${verse.verseNumber || ''} শ্লোক। ${translation}`;
        if (textToSpeak.trim()) {
          await speak(textToSpeak);
        }
      } catch (error) {
        console.error('Error speaking verse:', error);
      }
    }
  };

  if (isLoading || !verse) {
    return (
      <ImageBackground
        source={LayoutImages.background2}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={2.5}
      >
        <ThemedView variant="transparent" style={styles.container}>
          <PageHeader
            title={i18n.t('verseOfTheDay.title')}
            subtitle={i18n.t('verseOfTheDay.subtitle')}
            showBackButton={true}
          />
          <View style={styles.loadingContainer}>
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
            >
              {i18n.t('common.loading')}
            </ThemedLanguageText>
          </View>
        </ThemedView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={LayoutImages.background2}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <PageHeader
          title={i18n.t('verseOfTheDay.title')}
          subtitle={i18n.t('verseOfTheDay.subtitle')}
          showBackButton={true}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedCard variant="card" style={styles.introCard}>
            <ThemedView style={styles.introHeader}>
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
                style={styles.introTitle}
              >
                {i18n.t('verseOfTheDay.introTitle')}
              </ThemedLanguageText>
              <TouchableOpacity
                onPress={async () => {
                  if (isSpeaking) {
                    await stop();
                  } else {
                    await speak(i18n.t('verseOfTheDay.introText'));
                  }
                }}
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
              style={styles.introText}
            >
              {i18n.t('verseOfTheDay.introText')}
            </ThemedLanguageText>
          </ThemedCard>

          <SectionCard
            titleKey="verseOfTheDay.significanceTitle"
            content={i18n.t('verseOfTheDay.significanceText')}
          />

          {/* Date Badge */}
          <ThemedCard variant="card" style={styles.dateBadge}>
            <ThemedLanguageText
              variant="primary"
              size="small"
              style={styles.dateText}
              fontFamily="regional_secondary"
            >
              {new Date().toLocaleDateString('bn-BD', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </ThemedLanguageText>
          </ThemedCard>

          {/* Verse Card */}
          <ThemedCard variant="card" style={styles.verseCard} borderVariant="primary">
            <View style={styles.verseHeader}>
              <ThemedLanguageText
                variant="primary"
                size="large"
                style={styles.chapterInfo}
                fontFamily="regional_secondary"
              >
                {verse.chapterNumber} অধ্যায়, {verse.verseNumber} শ্লোক
              </ThemedLanguageText>
              <TouchableOpacity
                onPress={handleSpeakVerse}
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
            </View>

            {verse.verseText && (
              <View style={styles.verseTextContainer}>
                <ThemedLanguageText
                  variant="primary"
                  size="title"
                  style={styles.verseText}
                  fontFamily="regional_primary"
                >
                  {verse.verseText}
                </ThemedLanguageText>
              </View>
            )}

            {verse.translation && (
              <View style={styles.translationContainer}>
                <ThemedLanguageText
                  variant="secondary"
                  size="medium"
                  style={styles.translation}
                  fontFamily="regional_secondary"
                >
                  {verse.translation}
                </ThemedLanguageText>
              </View>
            )}
          </ThemedCard>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={SIZES.icon.md} color={theme.icon.primary} />
              <ThemedLanguageText
                variant="primary"
                size="medium"
                style={styles.actionButtonText}
                fontFamily="regional_secondary"
              >
                {i18n.t('verseOfTheDay.share')}
              </ThemedLanguageText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
              onPress={handleViewChapter}
            >
              <Ionicons name="book-outline" size={SIZES.icon.md} color={theme.icon.primary} />
              <ThemedLanguageText
                variant="primary"
                size="medium"
                style={styles.actionButtonText}
                fontFamily="regional_secondary"
              >
                {i18n.t('verseOfTheDay.viewChapter')}
              </ThemedLanguageText>
            </TouchableOpacity>
          </View>

          {/* Inspiration Message */}
          <ThemedCard variant="card" style={styles.inspirationCard}>
            <ThemedLanguageText
              variant="primary"
              size="medium"
              style={styles.inspirationText}
              fontFamily="regional_secondary"
            >
              {i18n.t('verseOfTheDay.inspirationMessage')}
            </ThemedLanguageText>
          </ThemedCard>

          <SectionCard
            titleKey="verseOfTheDay.benefitsTitle"
            content={i18n.t('verseOfTheDay.benefitsText')}
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

