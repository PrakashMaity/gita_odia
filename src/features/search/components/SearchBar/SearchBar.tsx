import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { styles } from './SearchBar.styles';

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
  const { theme } = useTheme();
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
    <ThemedView style={styles.container}>
      <ThemedView style={[
        styles.searchContainer,
        { 
          backgroundColor: theme.background.secondary,
          borderColor: theme.border.primary,
        }
      ]}>
        <Ionicons 
          name="search-outline" 
          size={20} 
          color={theme.icon.secondary} 
          style={styles.searchIcon}
        />
        
        <TextInput
          style={[
            styles.searchInput,
            { 
              color: theme.text.primary,
              backgroundColor: 'transparent',
            }
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.text.tertiary}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={theme.icon.secondary} 
            />
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
};

