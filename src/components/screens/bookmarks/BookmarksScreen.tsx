import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useBookmarkStore } from '@/store';
import { convertToLocalizedNumber } from '@/utils/numberConverter';
import { LayoutImages } from '@/utils/assets';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { EmptyState, LoadingState } from '@/components/shared';
import { BookmarkCard } from './components/BookmarkCard';
import { BookmarkHeader } from './components/BookmarkHeader';
import { useBookmarkOperations } from './hooks/useBookmarkOperations';
import { styles } from './BookmarksScreen.styles';

export const BookmarksScreen: React.FC = () => {
  const { theme } = useTheme();
  const { isLoading, getBookmarksSortedByDate } = useBookmarkStore();
  const { 
    handleRemoveBookmark, 
    handleBookmarkPress: baseHandleBookmarkPress,
    handleRemoveAllBookmarks,
    AlertComponent 
  } = useBookmarkOperations();
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

  // Enhanced bookmark press handler with ad logic
  const handleBookmarkPress = useCallback((chapterId: string, verseNumber: string) => {
    incrementAction();
    baseHandleBookmarkPress(chapterId, verseNumber);
    setTimeout(() => {
      showInterstitialIfReady();
    }, 500);
  }, [baseHandleBookmarkPress, incrementAction, showInterstitialIfReady]);

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  return (
    <ImageBackground
      key={refreshKey}
      source={LayoutImages.background1}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        {AlertComponent}

        <BookmarkHeader 
          bookmarkCount={sortedBookmarks.length}
          onClearAll={handleRemoveAllBookmarks}
        />

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
                {sortedBookmarks.map((bookmark, index) => (
                  <BookmarkCard
                    key={`${bookmark.verseId}-${index}`}
                    bookmark={bookmark}
                    index={index}
                    onPress={handleBookmarkPress}
                    onDelete={handleRemoveBookmark}
                  />
                ))}
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
    </ImageBackground>
  );
};


