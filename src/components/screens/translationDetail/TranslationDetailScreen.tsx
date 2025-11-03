import { BannerAds } from '@/components/ads';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { TranslationData, useTranslationStore } from '@/store';
import { getSpeakerImage } from '@/utils/speakerUtils';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { PageHeader } from '../shared/PageHeader';
import { LoadingState } from '../shared/LoadingState';

type TranslationVerse = NonNullable<TranslationData['verses']>[0];

export const TranslationDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTranslationById, isLoading } = useTranslationStore();
  
  const translationData = id ? getTranslationById(id) : null;

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  if (!translationData) {
    return (
      <ThemedView variant="primary" style={styles.errorContainer}>
        <ThemedLanguageText 
          variant="error" 
          size="medium"
          fontFamily="regional_secondary"
        >
          {i18n.t('common.error')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  const { chapter, verses } = translationData;

  const renderChatMessage = (verse: TranslationVerse, index: number) => {
    const shouldShowBanner = (index + 1) % 4 === 0;
    
    return (
      <ThemedView key={verse.id}>
        <ThemedCard style={[styles.chatMessage]}>
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
      <PageHeader title={`${chapter.title} || ${chapter.subtitle}`} />

      <ScrollView 
        style={styles.chatContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContent}
      >
        {verses?.map((verse, index) => renderChatMessage(verse, index))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  messageContent: {
    paddingLeft: SIZES.spacing.xl + SIZES.spacing.md,
  },
  translationText: {
    lineHeight: 24,
    textAlign: 'justify',
  },
  bannerContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginVertical: SIZES.spacing.sm,
  },
});

