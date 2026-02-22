import { LoadingState } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { convertToLocalizedNumber } from '@/lib/utils/numberConverter';
import { useBookmarkStore } from '@/store';
import { getLanguageFonts } from '@/types/font.interface';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { BookmarkCard } from './components/BookmarkCard';
import { BookmarkHeader } from './components/BookmarkHeader';
import { EmptyBookmarkState } from './components/EmptyBookmarkState';
import { useBookmarkOperations } from './hooks/useBookmarkOperations';

export const BookmarksScreen: React.FC = () => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
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
    <Box key={refreshKey} className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      {AlertComponent}

      <BookmarkHeader
        bookmarkCount={sortedBookmarks.length}
        onClearAll={handleRemoveAllBookmarks}
      />

      {sortedBookmarks.length === 0 ? (
        <EmptyBookmarkState />
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 64 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Section */}
          <Box
            className="flex-row items-center justify-between p-5 rounded-[24px] mb-6 shadow-sm border border-amber-100/50"
            style={{ backgroundColor: theme.background.primary }}
          >
            <HStack className="items-center">
              <Box
                className="w-2.5 h-8 rounded-full mr-4"
                style={{ backgroundColor: theme.status.success + '80' }}
              />
              <VStack>
                <Text
                  className="text-[14px] font-medium text-neutral-500 mb-0.5"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('bookmark.yourBookmarks')}
                </Text>
                <Text
                  className="text-[28px] font-black text-neutral-800 tracking-tight"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {convertToLocalizedNumber(sortedBookmarks.length.toString())}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Bookmarks List Section */}
          <VStack className="mb-6">
            <HStack className="items-center mb-4 px-2">
              <Box
                className="w-1.5 h-6 rounded-full mr-3"
                style={{ backgroundColor: theme.status.success + '60' }}
              />
              <Text
                className="text-[20px] font-black tracking-tight text-neutral-800"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('bookmark.recentBookmarks')}
              </Text>
            </HStack>

            <VStack space="md">
              {sortedBookmarks.map((bookmark, index) => (
                <BookmarkCard
                  key={`${bookmark.verseId}-${index}`}
                  bookmark={bookmark}
                  index={index}
                  onPress={handleBookmarkPress}
                  onDelete={handleRemoveBookmark}
                />
              ))}
            </VStack>
          </VStack>

          {/* Footer Message */}
          <Box
            className="rounded-[24px] p-5 shadow-sm border border-amber-100/50 items-center justify-center flex-col mt-4 mb-6"
            style={{ backgroundColor: theme.background.primary }}
          >
            <Box
              className="px-4 py-1.5 rounded-full mb-3"
              style={{ backgroundColor: theme.status.success + '15' }}
            >
              <Text
                className="text-[14px] font-bold"
                style={{ fontFamily: fonts.regional_secondary, color: theme.status.success }}
              >
                {i18n.t('bookmark.keepReading')}
              </Text>
            </Box>
            <Text
              className="text-[15px] font-medium text-center text-neutral-600 leading-6"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('bookmark.footerMessage')}
            </Text>
          </Box>

        </ScrollView>
      )}
    </Box>
  );
};
