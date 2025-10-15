import { BannerAds } from '@/components/ads';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useTranslationStore } from '@/store';
import { SpeakerImages } from '@/utils/assets';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface TranslationVerse {
  verseNumber: string;
  translation: string;
  speaker: string;
  id: string;
}

export default function TranslationDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTranslationById, isLoading } = useTranslationStore();
  
  const translationData = id ? getTranslationById(id) : null;





  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedLanguageText variant="secondary" size="medium">
          {i18n.t('common.loading')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  if (!translationData) {
    return (
      <ThemedView variant="primary" style={styles.errorContainer}>
        <ThemedLanguageText variant="error" size="medium">
          {i18n.t('common.error')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  const { chapter, verses } = translationData;

  // Get speaker avatar based on speaker name
  const getSpeakerAvatar = (speaker: string) => {
    // Map localized speaker names to images
    const localizedSpeakers = {
      [i18n.t('speakers.shreekrishna')]: SpeakerImages.shreekrishna,
      [i18n.t('speakers.arjuna')]: SpeakerImages.arjuna,
      [i18n.t('speakers.dhritarystra')]: SpeakerImages.dhritarystra,
      [i18n.t('speakers.sanjay')]: SpeakerImages.sanjay,
      [i18n.t('speakers.duryadhona')]: SpeakerImages.duryadhona,
      [i18n.t('speakers.parameshwar')]: SpeakerImages.shreekrishna,
      [i18n.t('speakers.shreebhagwan')]: SpeakerImages.shreekrishna,
    };
    
    return localizedSpeakers[speaker] || SpeakerImages.shreekrishna;
  };

  const renderChatMessage = (verse: TranslationVerse, index: number) => {
    const shouldShowBanner = (index + 1) % 4 === 0; // Show banner after every 4 slokas
    
    return (
      <ThemedView key={verse.id}>
        <ThemedCard 
          style={[
            styles.chatMessage,
          ]}
        >
          <ThemedView style={styles.messageHeader}>
            <ThemedView style={styles.speakerInfo}>
              <Image 
                source={getSpeakerAvatar(verse.speaker)} 
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
        
        {/* Banner Ad after every 4 slokas */}
        {shouldShowBanner && (
          <BannerAds 
            containerStyle={styles.bannerContainer}
          />
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView variant="primary" style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.xl} color={theme.icon.primary} />
        </TouchableOpacity>

        <ThemedView style={styles.headerContent}>
          <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="xl" style={styles.chapterTitle}>
            {chapter.title} || {chapter.subtitle}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedView>

      {/* Chat Messages */}
      <ScrollView 
        style={styles.chatContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContent}
      >
        {verses?.map((verse, index) => renderChatMessage(verse, index))}
      </ScrollView>

   
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.sm,
  },
  backButton: {
    marginRight: SIZES.spacing.lg,
    marginTop: SIZES.spacing.xs,
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    padding: SIZES.spacing.md,
  },
  chapterTitle: {
    // marginBottom: SIZES.spacing.xs,
    // lineHeight: 32,
  },
  chapterSubtitle: {
    marginBottom: SIZES.spacing.sm,
    // lineHeight: 24,
    opacity: 0.85,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.lg,
  },
  chatContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  chatMessage: {
   
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
   
  },
  currentMessage: {
    borderWidth: SIZES.borderSize.md,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  messageHeader: {
    marginBottom: SIZES.spacing.md,
  },
  speakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakerAvatar: {
    width: SIZES.avatar.lg,
    height: SIZES.avatar.lg,
    borderRadius: SIZES.radius.round,
    marginRight: SIZES.spacing.md,
  },
  speakerDetails: {
    flex: 1,
  },
  speakerName: {
   
    marginBottom: SIZES.spacing.xs,
  },
  verseNumber: {
    opacity: 0.7,
  },
  messageContent: {
    paddingLeft: SIZES.spacing.xl + SIZES.spacing.md,
  },
  translationText: {
    lineHeight: 24,
    textAlign: 'justify',
  },
  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
  },
  verseNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    gap: SIZES.spacing.sm,
    minHeight: 44,
  },
  verseCounter: {
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.radius.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  bannerContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginVertical: SIZES.spacing.sm,
  },
});
