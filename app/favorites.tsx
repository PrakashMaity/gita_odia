import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { createConfirmAlert, createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { FavoriteVerse, useFavoriteStore } from '@/store';
import { SpeakerImages } from '@/utils/assets';
import { convertToLocalizedNumber } from '@/utils/numberConverter';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { removeFavorite, clearAllFavorites, isLoading, getFavoritesSortedByDate } = useFavoriteStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  
  // Get current language
  const currentLang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';
  
  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    bn: 'bn-BD',
    or: 'or-IN',
    hi: 'hi-IN',
    as: 'as-IN',
  };
  
  // Get favorites sorted by date (newest first)
  const sortedFavorites = getFavoritesSortedByDate();

  const handleRemoveFavorite = async (verseId: string) => {
    try {
      await removeFavorite(verseId);
      showAlert(createSuccessAlert(i18n.t('favorite.removed'), i18n.t('favorite.removed')));
    } catch (error) {
      console.error('Error removing favorite:', error);
      showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('favorite.error')));
    }
  };

  const handleFavoritePress = (chapterId: string, verseNumber: string) => {
    // Convert Language numerals to English for verse parameter
    const convertLanguageToEnglish = (LanguageNum: string) => {
      return LanguageNum.replace(/[০-৯]/g, (match) => 
        String.fromCharCode(match.charCodeAt(0) - '০'.charCodeAt(0) + '0'.charCodeAt(0))
      );
    };
    
    const englishVerse = convertLanguageToEnglish(verseNumber);
    router.push(`/chapter/${chapterId}?verse=${englishVerse}`);
  };

  const handleRemoveAllFavorites = () => {
    showAlert(createConfirmAlert(
      i18n.t('favorite.clearAll'),
      i18n.t('favorite.clearAllConfirm'),
      async () => {
        try {
          await clearAllFavorites();
          showAlert(createSuccessAlert(i18n.t('common.success'), i18n.t('favorite.clearAllSuccess')));
        } catch (error) {
          console.error('Error clearing all favorites:', error);
          showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('favorite.error')));
        }
      }
    ));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const locale = localeMap[currentLang] || 'bn-BD';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get speaker avatar based on chapter number
  const getSpeakerAvatar = (chapterNumber: string) => {
    // You can add more speaker avatars here based on chapter
    switch (chapterNumber) {
      case '১':
        return SpeakerImages.dhritarystra;
      case '২':
      case '৩':
      case '৪':
      case '৫':
      case '৬':
      case '৭':
      case '৮':
      case '৯':
      case '১০':
      case '১১':
      case '১২':
      case '১৩':
      case '১৪':
      case '১৫':
      case '১৬':
      case '১৭':
      case '১৮':
        return SpeakerImages.shreekrishna;
      default:
        return SpeakerImages.shreekrishna;
    }
  };

  const renderFavorite = (favorite: FavoriteVerse, index: number) => (
    <TouchableOpacity
      key={`${favorite.verseId}-${index}`}
      onPress={() => handleFavoritePress(favorite.chapterId, favorite.verseNumber)}
      style={styles.favoriteCardContainer}
      activeOpacity={0.8}
    >
      <ThemedCard style={styles.chatMessage}>
        <ThemedView style={styles.messageHeader}>
          <ThemedView style={styles.speakerInfo}>
            <Image 
              source={getSpeakerAvatar(favorite.chapterNumber)} 
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
{i18n.t('chapter.chapter')} {favorite.chapterNumber} • {i18n.t('verse.verse')} {favorite.verseNumber}
              </ThemedLanguageText>
              <ThemedLanguageText 
                variant="secondary" 
                size="small" 
                fontFamily="regional_secondary"
                style={styles.favoriteDate}
              >
                {formatDate(favorite.timestamp)}
              </ThemedLanguageText>
            </ThemedView>
          </ThemedView>
          
          <TouchableOpacity
            onPress={() => handleRemoveFavorite(favorite.verseId)}
            style={styles.removeButton}
          >
            <Ionicons name="heart-dislike-outline" size={SIZES.icon.md} color={theme.icon.error} />
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.messageContent}>
          <ThemedLanguageText
            variant="primary"
            size="medium"
            fontFamily="regional_secondary"
            style={styles.translationText}
          >
            {favorite.verseText}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedLanguageText 
          variant="secondary" 
          size="medium"
          fontFamily="regional_secondary"
        >
          {i18n.t('common.loading')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="primary" style={styles.container}>
      {AlertComponent}
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.xl} color={theme.icon.primary} />
        </TouchableOpacity>

        <ThemedView style={styles.headerContent}>
          <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="title" style={styles.chapterTitle}>
            {i18n.t('favorite.favorites')}
          </ThemedLanguageText>
          {sortedFavorites.length > 0 && (
            <ThemedLanguageText 
              variant="secondary" 
              size="large" 
              fontFamily="regional_secondary"
              style={styles.chapterSubtitle}
            >
              {i18n.t('favorite.totalFavorites', { count: convertToLocalizedNumber(sortedFavorites.length) })}
            </ThemedLanguageText>
          )}
        </ThemedView>
        
        {sortedFavorites.length > 0 && (
          <TouchableOpacity
            onPress={handleRemoveAllFavorites}
            style={styles.clearAllButton}
          >
            <Ionicons name="trash-outline" size={SIZES.icon.lg} color={theme.icon.error} />
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Favorites List */}
      {sortedFavorites.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={theme.icon.tertiary} />
          <ThemedLanguageText 
            variant="primary" 
            size="xl" 
            fontFamily="regional_secondary"
            style={styles.emptyTitle}
          >
            {i18n.t('favorite.noFavorites')}
          </ThemedLanguageText>
          <ThemedLanguageText 
            variant="secondary" 
            size="medium" 
            fontFamily="regional_secondary"
            style={styles.emptySubtitle}
          >
            {i18n.t('favorite.favoriteHint')}
          </ThemedLanguageText>
        </ThemedView>
      ) : (
        <ScrollView 
          style={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
        >
          {sortedFavorites.map((favorite, index) => renderFavorite(favorite, index))}
        </ScrollView>
      )}
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
    marginBottom: SIZES.spacing.xs,
    lineHeight: 32,
  },
  chapterSubtitle: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 24,
    opacity: 0.85,
  },
  clearAllButton: {
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.lg,
  },
  chatContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  favoriteCardContainer: {
    marginBottom: SIZES.spacing.md,
  },
  chatMessage: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.md,
  },
  speakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  favoriteDate: {
    opacity: 0.7,
  },
  messageContent: {
    paddingLeft: SIZES.spacing.xl + SIZES.spacing.md,
  },
  translationText: {
    lineHeight: 24,
    textAlign: 'justify',
  },
  removeButton: {
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.round,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl,
  },
  emptyTitle: {
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
});
