import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { createConfirmAlert, createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { FavoriteVerse, useFavoriteStore } from '@/store';
import { formatFullDate } from '@/utils/dateUtils';
import { getSpeakerAvatar } from '@/utils/speakerUtils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { PageHeader } from '../shared/PageHeader';
import { EmptyState } from '../shared/EmptyState';
import { LoadingState } from '../shared/LoadingState';

export const FavoritesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { removeFavorite, clearAllFavorites, isLoading, getFavoritesSortedByDate } = useFavoriteStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  
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
                {formatFullDate(favorite.timestamp)}
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
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  return (
    <ThemedView variant="primary" style={styles.container}>
      {AlertComponent}
      <PageHeader
        title={i18n.t('favorite.favorites')}
        subtitle={sortedFavorites.length > 0 ? i18n.t('favorite.totalFavorites', { count: sortedFavorites.length }) : undefined}
        rightAction={
          sortedFavorites.length > 0 ? (
            <TouchableOpacity
              onPress={handleRemoveAllFavorites}
              style={styles.clearAllButton}
            >
              <Ionicons name="trash-outline" size={SIZES.icon.lg} color={theme.icon.error} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      {sortedFavorites.length === 0 ? (
        <EmptyState
          icon={<Ionicons name="heart-outline" size={64} color={theme.icon.tertiary} />}
          title={i18n.t('favorite.noFavorites')}
          subtitle={i18n.t('favorite.favoriteHint')}
        />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  clearAllButton: {
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

