import { BannerAdComponent } from '@/components/ads';
import { LoadingState } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useBookmarkStore } from '@/store';
import { LayoutImages } from '@/lib/utils/assets';
import { convertToLocalizedNumber } from '@/lib/utils/numberConverter';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { styles } from './BookmarksScreen.styles';
import { BookmarkCard } from './components/BookmarkCard';
import { BookmarkHeader } from './components/BookmarkHeader';
import { EmptyBookmarkState } from './components/EmptyBookmarkState';
import { useBookmarkOperations } from './hooks/useBookmarkOperations';

export const BookmarksScreen: React.FC = () => {
  const theme = useThemeColors();
  const { isLoading, getBookmarksSortedByDate } = useBookmarkStore();
  const { 
    handleRemoveBookmark, 
    handleBookmarkPress: baseHandleBookmarkPress,
    handleRemoveAllBookmarks,
    AlertComponent 
  } = useBookmarkOperations();

  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const sortedBookmarks = getBookmarksSortedByDate();

  const handleBookmarkPress = useCallback((chapterId: string, verseNumber: string) => {
    baseHandleBookmarkPress(chapterId, verseNumber);
  }, [baseHandleBookmarkPress]);

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
          <EmptyBookmarkState />
        ) : (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Section */}
            <ThemedView style={styles.statsSection}>
              <ThemedCard variant="card" style={styles.statsCard} borderVariant="none">
                <ThemedView style={styles.statsHeader}>
                  <ThemedView style={[styles.statsIndicator, { backgroundColor: theme.status.success + '40' }]} />
                  <ThemedLanguageText 
                    variant="primary" 
                    size="large" 
                    fontFamily="regional_secondary"
                    style={styles.statsTitle}
                  >
                    {i18n.t('bookmark.yourBookmarks')}
                  </ThemedLanguageText>
                </ThemedView>
                <ThemedLanguageText
                  variant="secondary"
                  size="medium"
                  style={styles.statsText}
                  fontFamily="regional_secondary"
                >
                  {convertToLocalizedNumber(i18n.t('bookmark.totalBookmarks', { count: sortedBookmarks.length || 0 }))}
                </ThemedLanguageText>
              </ThemedCard>
            </ThemedView>

            {/* Bookmarks List Section */}
            <ThemedView style={styles.section}>
              <ThemedView style={styles.sectionHeader}>
                <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.status.success + '60' }]} />
                <ThemedLanguageText 
                  variant="primary" 
                  size="title" 
                  fontFamily="regional_secondary"
                  style={styles.sectionTitle}
                >
                  {i18n.t('bookmark.recentBookmarks')}
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

            {/* Footer Message */}
            <ThemedCard variant="card" style={styles.footerCard} borderVariant="none">
              <ThemedView style={styles.footerHeader}>
                <ThemedView style={[styles.footerIndicator, { backgroundColor: theme.status.success + '40' }]} />
                <ThemedLanguageText 
                  variant="primary" 
                  size="large" 
                  fontFamily="regional_secondary"
                  style={styles.footerTitle}
                >
                  {i18n.t('bookmark.keepReading')}
                </ThemedLanguageText>
              </ThemedView>
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                style={styles.footerText}
                fontFamily="regional_secondary"
              >
                {i18n.t('bookmark.footerMessage')}
              </ThemedLanguageText>
            </ThemedCard>

            {/* Banner Ad */}
            <ThemedView style={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg }}>
              <BannerAdComponent />
            </ThemedView>
          </ScrollView>
        )}
      </ThemedView>
    </ImageBackground>
  );
};
