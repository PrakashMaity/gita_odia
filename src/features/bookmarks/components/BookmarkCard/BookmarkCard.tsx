import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Bookmark } from '@/store';
import { formatFullDate } from '@/lib/utils/dateUtils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './BookmarkCard.styles';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  onPress: (chapterId: string, verseNumber: string) => void;
  onDelete: (verseId: string) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  index,
  onPress,
  onDelete,
}) => {
  const theme = useThemeColors();

  return (
    <TouchableOpacity
      key={`${bookmark.verseId}-${index}`}
      onPress={() => onPress(bookmark.chapterId, bookmark.verseNumber)}
      style={styles.container}
      activeOpacity={0.7}
    >
      <ThemedCard 
        variant="card" 
        style={[styles.card, { shadowOpacity: 0, elevation: 0 }]}
        pattern="mandala"
        patternOpacity={0.05}
        borderVariant="none"
      >
        {/* Left Indicator Bar */}
        <ThemedView 
          style={[styles.indicatorBar, { backgroundColor: theme.status.success + '60' }]} 
        />

        {/* Content Container */}
        <ThemedView style={styles.contentContainer}>
          {/* Header Section */}
          <ThemedView style={styles.headerSection}>
            <ThemedView style={styles.headerLeft}>
              {/* Chapter Number Badge */}
              <ThemedView 
                style={[styles.chapterBadge, { 
                  backgroundColor: theme.status.success + '20',
                }]}
              >
                <ThemedLanguageText 
                  variant="primary" 
                  size="large" 
                  fontFamily="regional_primary"
                  style={[styles.chapterNumber, { color: theme.status.success }]}
                >
                  {bookmark.chapterNumber}
                </ThemedLanguageText>
              </ThemedView>

              {/* Chapter and Verse Info */}
              <ThemedView style={styles.chapterInfo}>
                <ThemedLanguageText
                  variant="primary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.chapterTitle}
                  numberOfLines={1}
                >
                  {i18n.t('chapter.chapter')} {bookmark.chapterNumber}
                </ThemedLanguageText>
                <ThemedLanguageText
                  variant="secondary"
                  size="small"
                  fontFamily="regional_secondary"
                  style={styles.verseInfo}
                >
                  {i18n.t('verse.verse')} {bookmark.verseNumber}
                </ThemedLanguageText>
              </ThemedView>
            </ThemedView>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete(bookmark.verseId);
              }}
              style={[styles.deleteButton, { backgroundColor: theme.status.error + '15' }]}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="trash-outline" 
                size={SIZES.icon.xs} 
                color={theme.status.error} 
              />
            </TouchableOpacity>
          </ThemedView>

          {/* Verse Text Section */}
          <ThemedView style={styles.verseSection}>
            <ThemedView style={styles.verseTextContainer}>
              <ThemedLanguageText 
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.verseText}
                numberOfLines={4}
              >
                {bookmark.verseText}
              </ThemedLanguageText>
            </ThemedView>
          </ThemedView>

          {/* Footer Section with Date and Arrow */}
          <ThemedView 
            style={styles.footerSection}
          >
            <ThemedView style={styles.dateContainer}>
              <MaterialIcons 
                name="bookmark" 
                size={SIZES.icon.xs} 
                color={theme.icon.secondary} 
                style={styles.bookmarkIcon}
              />
              <ThemedLanguageText 
                variant="tertiary" 
                size="small" 
                fontFamily="regional_secondary"
                style={styles.bookmarkDate}
              >
                {formatFullDate(bookmark.timestamp)}
              </ThemedLanguageText>
            </ThemedView>

            {/* Arrow Icon */}
            <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.quaternary }]}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={SIZES.icon.xs}
                color={theme.icon.quaternary}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );
};

