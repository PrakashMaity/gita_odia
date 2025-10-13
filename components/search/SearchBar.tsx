import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  value?: string;
}

export default function SearchBar({ 
  onSearch, 
  onClear, 
  placeholder = "ଅନୁସନ୍ଧାନ କରନ୍ତୁ...", 
  value = "" 
}: SearchBarProps) {
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
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
  },
  searchIcon: {
    marginRight: SIZES.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    paddingVertical: SIZES.spacing.xs,
  },
  clearButton: {
    marginLeft: SIZES.spacing.sm,
    padding: SIZES.spacing.xs,
  },
});
