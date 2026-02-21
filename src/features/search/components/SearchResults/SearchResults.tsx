import { BannerAdComponent } from '@/components/ads';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SearchResult } from '@/types/screen.interface';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './SearchResults.styles';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultPress: (chapterNumber: number, verseNumber: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, query, onResultPress }) => {
  const { theme } = useTheme();

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <ThemedText key={index} style={{ backgroundColor: theme.status.warning, color: theme.text.primary }}>
            {part}
          </ThemedText>
        );
      }
      return part;
    });
  };

  const getMatchTypeText = (matchType: string) => {
    switch (matchType) {
      case 'sanskrit':
        return i18n.t('search.sanskrit');
      case 'Language':
        return i18n.t('search.bengali');
      case 'translation':
        return i18n.t('search.translation');
      default:
        return '';
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'sanskrit':
        return theme.button.primary.background;
      case 'Language':
        return theme.status.success;
      case 'translation':
        return theme.status.info;
      default:
        return theme.icon.secondary;
    }
  };

  if (results.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color={theme.icon.tertiary} />
        <ThemedText style={{ ...styles.emptyTitle, color: theme.text.primary }}>
          {i18n.t('search.noResults')}
        </ThemedText>
        <ThemedText style={{ ...styles.emptySubtitle, color: theme.text.secondary }}>
          {i18n.t('search.noResultsFor', { query })}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.resultsHeader}>
        <ThemedText style={{ ...styles.resultsCount, color: theme.text.secondary }}>
          {i18n.t('searchResults.foundResults', { count: results.length })}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.resultsList}>
        {results.map((result, index) => (
          <TouchableOpacity
            key={`${result.chapterNumber}-${result.verseNumber}-${index}`}
            onPress={() => onResultPress(result.chapterNumber, result.verseNumber)}
            style={styles.resultCardContainer}
          >
            <ThemedCard style={styles.resultCard}>
              <ThemedView style={styles.resultHeader}>
                <ThemedView style={styles.chapterInfo}>
                  <ThemedView style={[styles.chapterNumberContainer, { backgroundColor: theme.button.primary.background }]}>
                    <ThemedText style={{ ...styles.chapterNumber, color: theme.button.primary.text }}>
                      {result.chapterNumber}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.verseInfo}>
                    <ThemedText style={{ ...styles.verseTitle, color: theme.text.primary }}>
                      {i18n.t('chapter.chapter')} {result.chapterNumber} • {i18n.t('verse.verse')} {result.verseNumber}
                    </ThemedText>
                    <ThemedText style={{ ...styles.speaker, color: theme.text.tertiary }}>
                      - {result.speaker}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView style={[
                  styles.matchTypeBadge,
                  { backgroundColor: getMatchTypeColor(result.matchType) }
                ]}>
                  <ThemedText style={{ ...styles.matchTypeText, color: 'white' }}>
                    {getMatchTypeText(result.matchType)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={styles.resultContent}>
                <ThemedText style={{ ...styles.verseText, color: theme.text.primary }}>
                  {highlightText(result.verseText, query)}
                </ThemedText>
                
                {result.translation && (
                  <ThemedText style={{ ...styles.translationText, color: theme.text.secondary }}>
                    {highlightText(result.translation, query)}
                  </ThemedText>
                )}
              </ThemedView>
              
              <ThemedView style={styles.resultFooter}>
                <Ionicons name="chevron-forward" size={16} color={theme.icon.primary} />
              </ThemedView>
            </ThemedCard>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Banner Ad */}
      <ThemedView style={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg }}>
        <BannerAdComponent />
      </ThemedView>
    </ScrollView>
  );
};


