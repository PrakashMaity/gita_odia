import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface SearchResult {
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  translation: string;
  speaker: string;
  matchType: 'sanskrit' | 'Language' | 'translation';
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultPress: (chapterNumber: number, verseNumber: number) => void;
}

export default function SearchResults({ results, query, onResultPress }: SearchResultsProps) {
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  resultsHeader: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.sm,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: SIZES.spacing.lg,
  },
  resultCardContainer: {
    marginBottom: SIZES.spacing.md,
  },
  resultCard: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chapterNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing.md,
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  verseInfo: {
    flex: 1,
  },
  verseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing.xs,
  },
  speaker: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  matchTypeBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
  },
  matchTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultContent: {
    marginBottom: SIZES.spacing.md,
  },
  verseText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SIZES.spacing.sm,
  },
  translationText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  resultFooter: {
    alignItems: 'flex-end',
  },
});
