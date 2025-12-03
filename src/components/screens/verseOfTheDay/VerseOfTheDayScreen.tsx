import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Share, ImageBackground } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { PageHeader } from '@/components/shared';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';
import { useVerseOfTheDayStore } from '@/store/verseOfTheDayStore';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { LayoutImages } from '@/utils/assets';
import { styles } from './VerseOfTheDayScreen.styles';

export const VerseOfTheDayScreen: React.FC = () => {
  const { loadVerseOfTheDay, getTodaysVerse, shareVerse, isLoading } = useVerseOfTheDayStore();
  const theme = useThemeColors();
  const verse = getTodaysVerse();

  useEffect(() => {
    loadVerseOfTheDay();
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
      <ThemedView variant="transparent" style={styles.content}>
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
            </View>

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
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

