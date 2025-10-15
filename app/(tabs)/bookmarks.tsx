import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { createConfirmAlert, createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { Bookmark, useBookmarkStore } from '@/store';
import { convertToLocalizedNumber } from '@/utils/numberConverter';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookmarksScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { removeBookmark, clearAllBookmarks, isLoading, getBookmarksSortedByDate } = useBookmarkStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { incrementAction, showInterstitialIfReady } = useAdFrequency({
    interstitialInterval: 2, // Show interstitial every 2 bookmark actions
  });
  
  // State to force re-render when bookmarks change
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Get current language
  const currentLang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';
  
  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    bn: 'bn-BD',
    or: 'or-IN',
    hi: 'hi-IN',
    as: 'as-IN',
  };
  
  // Use focus effect to refresh bookmarks when tab is focused
  useFocusEffect(
    useCallback(() => {
      // Force re-render by updating refresh key
      // This ensures the component re-renders with the latest bookmark data
      setRefreshKey(prev => prev + 1);
    }, [])
  );
  
  // Get bookmarks sorted by date (newest first)
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
    
    // Convert Language numerals to English for verse parameter
    const convertLanguageToEnglish = (LanguageNum: string) => {
      return LanguageNum.replace(/[০-৯]/g, (match) => 
        String.fromCharCode(match.charCodeAt(0) - '০'.charCodeAt(0) + '0'.charCodeAt(0))
      );
    };
    
    const englishVerse = convertLanguageToEnglish(verseNumber);
    router.push(`/chapter/${chapterId}?verse=${englishVerse}`);
    
    // Show interstitial after navigation
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const locale = localeMap[currentLang] || 'bn-BD';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderBookmark = (bookmark: Bookmark, index: number) => (
    <TouchableOpacity
      key={`${bookmark.verseId}-${index}`}
      onPress={() => handleBookmarkPress(bookmark.chapterId, bookmark.verseNumber)}
      style={styles.bookmarkCardContainer}
      
    >
      <ThemedCard style={[styles.bookmarkCard, { 
       
        
      }]}>
        {/* Delete Button - Top Right */}
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
            style={styles.chapterNumber}
          >
            {bookmark.chapterNumber}
          </ThemedLanguageText>
        </ThemedView>

        {/* Text Content */}
        <ThemedView style={styles.textContainer}>
          <ThemedLanguageText
            variant="primary"
            size="medium"
            fontFamily="regional_secondary"
            style={styles.bookmarkTitle}
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
              ({formatDate(bookmark.timestamp)})
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

        {/* Arrow Button - Bottom Right
        <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.quaternary }]}>
          <MaterialIcons 
            name="arrow-forward-ios" 
            size={SIZES.icon.md} 
            color={theme.icon.quaternary} 
          />
        </ThemedView> */}
      </ThemedCard>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedSafeAreaView>
        <ThemedView style={styles.loadingContainer}>
          <WavePattern width={200} height={200} opacity={0.1} />
          <ThemedLanguageText 
            variant="secondary" 
            size="large" 
            fontFamily="regional_secondary"
            style={styles.loadingText}
          >
{i18n.t('common.loading')}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedSafeAreaView>
    );
  }

  return (
    <ThemedView key={refreshKey} variant="primary" style={styles.container}>
      {AlertComponent}
      <WavePattern 
        width={width} 
        height={height} 
      />
      
      {/* Header Card */}
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


      {/* Bookmarks List */}
      {sortedBookmarks.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={theme.icon.tertiary} />
          <ThemedLanguageText 
            variant="primary" 
            size="xl" 
            fontFamily="regional_secondary"
            style={styles.emptyTitle}
          >
{i18n.t('bookmark.noBookmarks')}
          </ThemedLanguageText>
          <ThemedLanguageText 
            variant="secondary" 
            size="medium" 
            fontFamily="regional_secondary"
            style={styles.emptySubtitle}
          >
{i18n.t('bookmark.bookmarkHint')}
          </ThemedLanguageText>
        </ThemedView>
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
          
          {/* Footer Info */}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.spacing.lg,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
  },
  actionButton: {
    borderWidth: SIZES.borderSize.sm,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: 5,
    height: 32,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '600',
  },
  bookmarksContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.sm,
  },
  bookmarkCardContainer: {
    marginBottom: SIZES.spacing.md,
  },
  bookmarkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
    marginBottom: SIZES.spacing.sm,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.15,
    shadowRadius: SIZES.shadow.lg,
    elevation: 4,
    position: 'relative',
  },
  iconContainer: {
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.2,
    shadowRadius: SIZES.shadow.md,
    elevation: 3,
  },
  chapterNumber: {
    // Font styling handled by ThemedLanguageText component
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bookmarkTitle: {
    // marginBottom: SIZES.spacing.xs,
  },
  bookmarkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.sm,
  },
  bookmarkDate: {
    opacity: 0.9,
  },
  verseText: {
    lineHeight: 22,
    opacity: 0.85,
  },
  deleteButton: {
    position: 'absolute',
    top: SIZES.spacing.sm,
    right: SIZES.spacing.sm,
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.25,
    shadowRadius: SIZES.shadow.md,
    elevation: 4,
  },
  arrowContainer: {
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.round,
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
  footer: {
    alignItems: 'center',
    marginTop: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
  },
  footerText: {
    textAlign: 'center',
  },
});
