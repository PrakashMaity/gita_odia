import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { SearchResult } from '@/types/screen.interface';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultPress: (chapterNumber: number, verseNumber: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, query, onResultPress }) => {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <Text key={index} className="bg-white text-black font-bold">
            {part}
          </Text>
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

  const getMatchTypeClass = (matchType: string) => {
    switch (matchType) {
      case 'sanskrit':
        return 'bg-white';
      case 'Language':
        return 'bg-neutral-200';
      case 'translation':
        return 'bg-neutral-800';
      default:
        return 'bg-neutral-900 border border-neutral-700';
    }
  };

  const getMatchTypeTextClass = (matchType: string) => {
    switch (matchType) {
      case 'sanskrit':
      case 'Language':
        return 'text-black';
      default:
        return 'text-white';
    }
  };

  if (results.length === 0) {
    return (
      <Box className="flex-1 justify-center items-center px-6">
        <Ionicons name="search-outline" size={64} color="#6b7280" />
        <Text className="text-xl font-bold mt-6 mb-2 text-center text-white">
          {i18n.t('search.noResults')}
        </Text>
        <Text className="text-base text-center leading-6 text-neutral-400">
          {i18n.t('search.noResultsFor', { query })}
        </Text>
      </Box>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <Box className="px-6 py-2 pb-4">
        <Text className="text-sm font-medium text-neutral-400">
          {i18n.t('searchResults.foundResults', { count: results.length })}
        </Text>
      </Box>

      <Box className="px-6">
        {results.map((result, index) => (
          <TouchableOpacity
            key={`${result.chapterNumber}-${result.verseNumber}-${index}`}
            onPress={() => onResultPress(result.chapterNumber, result.verseNumber)}
            className="mb-4"
            activeOpacity={0.7}
          >
            <Box className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
              <Box className="flex-row justify-between items-center mb-4">
                <Box className="flex-row items-center flex-1">
                  <Box className="w-10 h-10 rounded-full justify-center items-center mr-4 bg-white">
                    <Text className="text-base font-bold text-black font-regional_secondary">
                      {result.chapterNumber}
                    </Text>
                  </Box>
                  <Box className="flex-1">
                    <Text className="text-base font-bold mb-1 text-white font-regional_secondary">
                      {i18n.t('chapter.chapter')} {result.chapterNumber} • {i18n.t('verse.verse')} {result.verseNumber}
                    </Text>
                    <Text className="text-xs text-neutral-500 font-regional_secondary">
                      - {result.speaker}
                    </Text>
                  </Box>
                </Box>

                <Box className={`px-2 py-1 rounded-md ${getMatchTypeClass(result.matchType)}`}>
                  <Text className={`text-[10px] font-bold uppercase ${getMatchTypeTextClass(result.matchType)}`}>
                    {getMatchTypeText(result.matchType)}
                  </Text>
                </Box>
              </Box>

              <Box className="mb-4">
                <Text className="text-sm leading-5 mb-2 text-white font-regional_primary">
                  {highlightText(result.verseText, query)}
                </Text>

                {result.translation && (
                  <Text className="text-[13px] leading-[18px] text-neutral-400 font-regional_secondary">
                    {highlightText(result.translation, query)}
                  </Text>
                )}
              </Box>

              <Box className="items-end">
                <Ionicons name="chevron-forward" size={16} color="white" />
              </Box>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
    </ScrollView>
  );
};
