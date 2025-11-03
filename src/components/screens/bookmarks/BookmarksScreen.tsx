import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { SIZES } from '@/rootconstants/sizes';
import { createConfirmAlert, createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Bookmark, useBookmarkStore } from '@/store';
import { formatFullDate } from '@/utils/dateUtils';
import { convertToLocalizedNumber } from '@/utils/numberConverter';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { EmptyState } from '../shared/EmptyState';
import { LoadingState } from '../shared/LoadingState';
import { styles } from './BookmarksScreen.styles';

export const BookmarksScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { removeBookmark, clearAllBookmarks, isLoading, getBookmarksSortedByDate } = useBookmarkStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { incrementAction, showInterstitialIfReady } = useAdFrequency({
    interstitialInterval: 2,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const sortedBookmarks = getBookmarksSortedByDate();

  const handleRemoveBookmark = async (verseId: string) => {
    try {
      await removeBookmark(verseId);
      showAlert(createSuccessAlert(i18n.t('bookmark.removed'), i18n.t('bookmark.removed')));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('bookmark.error')));
    }
  };

  const handleBookmarkPress = (chapterId: string, verseNumber: string) => {
    incrementAction();
    
    const convertLanguageToEnglish = (LanguageNum: string) => {
      return LanguageNum.replace(/[০-৯]/g, (match) => 
        String.fromCharCode(match.charCodeAt(0) - '০'.charCodeAt(0) + '0'.charCodeAt(0))
      );
    };
    
    const englishVerse = convertLanguageToEnglish(verseNumber);
    router.push(`/chapter/${chapterId}?verse=${englishVerse}`);
    
    setTimeout(() => {
      showInterstitialIfReady();
    }, 500);
  };

  const handleRemoveAllBookmarks = () => {
    showAlert(createConfirmAlert(
      i18n.t('bookmark.clearAll'),
      i18n.t('bookmark.clearAllConfirm'),
      async () => {
        try {
          await clearAllBookmarks();
          showAlert(createSuccessAlert(i18n.t('common.success'), i18n.t('bookmark.clearAllSuccess')));
        } catch (error) {
          console.error('Error clearing all bookmarks:', error);
          showAlert(createErrorAlert(i18n.t('common.error'), i18n.t('bookmark.error')));
        }
      }
    ));
  };

  const renderBookmark = (bookmark: Bookmark, index: number) => (
    <TouchableOpacity
      key={`${bookmark.verseId}-${index}`}
      onPress={() => handleBookmarkPress(bookmark.chapterId, bookmark.verseNumber)}
      style={styles.bookmarkCardContainer}
    >
      <ThemedCard style={[styles.bookmarkCard]}>
        <TouchableOpacity
          onPress={() => handleRemoveBookmark(bookmark.verseId)}
          style={[styles.deleteButton, { backgroundColor: theme.background.quaternary }]}
        >
          <Ionicons name="cut" size={SIZES.icon.xs} color={theme.icon.error} />
        </TouchableOpacity>

        <ThemedView style={[styles.iconContainer, { 
          backgroundColor: theme.background.tertiary,
        }]}>
          <ThemedLanguageText 
            variant="primary" 
            size="large" 
            fontFamily="regional_primary"
          >
            {bookmark.chapterNumber}
          </ThemedLanguageText>
        </ThemedView>

        <ThemedView style={styles.textContainer}>
          <ThemedLanguageText
            variant="primary"
            size="medium"
            fontFamily="regional_secondary"
            numberOfLines={2}
          >
            {i18n.t('chapter.chapter')} {bookmark.chapterNumber} || {i18n.t('verse.verse')} {bookmark.verseNumber}
          </ThemedLanguageText>

          <ThemedView style={styles.bookmarkInfo}>
            <ThemedLanguageText 
              variant="secondary" 
              size="small" 
              fontFamily="regional_secondary"
              style={styles.bookmarkDate}
            >
              ({formatFullDate(bookmark.timestamp)})
            </ThemedLanguageText>
          </ThemedView>

          <ThemedLanguageText 
            variant="secondary"
            size="small"
            fontFamily="regional_secondary"
            style={styles.verseText}
            numberOfLines={3}
          >
            {bookmark.verseText}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  return (
    <ThemedView key={refreshKey} variant="primary" style={styles.container}>
      {AlertComponent}
      <WavePattern width={width} height={height} />

      <ThemedCard variant='transparent' style={styles.headerCard}>
        <ThemedLanguageText 
          variant="primary" 
          size="title" 
          fontFamily="regional_secondary"
          style={styles.title}
        >
          {i18n.t('bookmark.bookmarks')}
        </ThemedLanguageText>
        <ThemedView style={styles.headerActions}>
          <ThemedView style={[styles.actionButton, { borderColor: theme.border.primary }]}>
            <BookmarkIcon 
              size={SIZES.icon.md} 
              color={theme.icon.primary} 
              focused={true}
              showBadge={true}
              badgeSize="medium"
            />
          </ThemedView>
          {sortedBookmarks.length > 0 && (
            <TouchableOpacity
              onPress={handleRemoveAllBookmarks}
              style={[styles.actionButton, { borderColor: theme.border.error }]}
            >
              <Ionicons name="trash-outline" size={SIZES.icon.md} color={theme.icon.error} />
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedCard>

      {sortedBookmarks.length === 0 ? (
        <EmptyState
          icon={<Ionicons name="bookmark-outline" size={64} color={theme.icon.tertiary} />}
          title={i18n.t('bookmark.noBookmarks')}
          subtitle={i18n.t('bookmark.bookmarkHint')}
        />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.section}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
              <ThemedLanguageText 
                variant="primary" 
                size="large" 
                fontFamily="regional_secondary"
                style={styles.sectionTitle}
              >
                {i18n.t('bookmark.bookmarks')}
              </ThemedLanguageText>
            </ThemedView>
            <ThemedView style={styles.bookmarksContainer}>
              {sortedBookmarks.map(renderBookmark)}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.footer}>
            <ThemedLanguageText 
              variant="tertiary" 
              size="small" 
              fontFamily="regional_secondary"
              style={styles.footerText}
            >
              {convertToLocalizedNumber(i18n.t('bookmark.totalBookmarks', { count: sortedBookmarks.length || 0 }))}
            </ThemedLanguageText>
          </ThemedView>
        </ScrollView>
      )}
    </ThemedView>
  );
};


