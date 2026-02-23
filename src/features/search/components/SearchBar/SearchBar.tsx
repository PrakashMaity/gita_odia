import { Box } from '@/components/ui/box';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  value?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = i18n.t('search.placeholder'),
  value = ""
}) => {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
  };

  return (
    <Box className="px-6 py-4">
      <Box className="flex-row items-center rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2">
        <Ionicons
          name="search-outline"
          size={20}
          color="#9ca3af" // neutral-400
          className="mr-2"
        />

        <TextInput
          className="flex-1 text-base py-2 text-white bg-transparent"
          placeholder={placeholder}
          placeholderTextColor="#6b7280" // neutral-500
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="ml-2 p-1">
            <Ionicons
              name="close-circle"
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
};
