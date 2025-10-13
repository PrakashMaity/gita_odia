import { SIZES } from '@/constants/sizes';
import React from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { useThemeColors } from '../../../hooks/useTheme';
import { GridVariant, ThemedGridProps } from './types';

export const ThemedGrid: React.FC<ThemedGridProps> = ({
  data,
  renderItem,
  numColumns = 2,
  variant = 'transparent',
  style,
  itemStyle,
  gap = SIZES.spacing.md,
  keyExtractor,
  centerItems = false,
  itemWidth,
}) => {
  const theme = useThemeColors();
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = SIZES.spacing.lg * 2; // Left and right padding
  const availableWidth = screenWidth - containerPadding;
  
  // Calculate item width based on numColumns and gap
  const calculatedItemWidth = itemWidth || (availableWidth - (gap * (numColumns - 1))) / numColumns;

  const getGridStyle = (): ViewStyle | ViewStyle[] => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: centerItems ? 'center' : 'flex-start',
      gap: gap,
    };

    // Variant styles
    const variantStyles: Record<GridVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.background.primary,
      },
      secondary: {
        backgroundColor: theme.background.secondary,
      },
      card: {
        backgroundColor: theme.background.card,
        borderRadius: SIZES.radius.md,
        padding: SIZES.spacing.md,
      },
      tertiary: {
        backgroundColor: theme.background.tertiary,
      },
      quaternary: {
        backgroundColor: theme.background.quaternary,
      },
      transparent: {
        backgroundColor: 'transparent',
      },
    };

    const finalStyle = {
      ...baseStyle,
      ...variantStyles[variant],
    };

    // Handle both single style and array of styles
    if (Array.isArray(style)) {
      return [finalStyle, ...style];
    }

    return {
      ...finalStyle,
      ...style,
    };
  };

  const getItemStyle = (): ViewStyle | ViewStyle[] => {
    const baseItemStyle: ViewStyle = {
      width: calculatedItemWidth,
      marginBottom: gap,
    };

    // Handle both single style and array of styles
    if (Array.isArray(itemStyle)) {
      return [baseItemStyle, ...itemStyle];
    }

    return {
      ...baseItemStyle,
      ...itemStyle,
    };
  };

  // Group items into rows
  const rows: any[][] = [];
  for (let i = 0; i < data.length; i += numColumns) {
    rows.push(data.slice(i, i + numColumns));
  }

  return (
    <View style={getGridStyle()}>
      {rows.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: centerItems ? 'center' : 'flex-start',
            gap: gap,
            marginBottom: rowIndex < rows.length - 1 ? gap : 0,
          }}
        >
          {row.map((item, itemIndex) => {
            const globalIndex = rowIndex * numColumns + itemIndex;
            const key = keyExtractor ? keyExtractor(item, globalIndex) : `item-${globalIndex}`;
            
            return (
              <View key={key} style={getItemStyle()}>
                {renderItem(item, globalIndex)}
              </View>
            );
          })}
          {/* Fill remaining columns with empty views to maintain alignment */}
          {row.length < numColumns && Array.from({ length: numColumns - row.length }).map((_, emptyIndex) => (
            <View
              key={`empty-${rowIndex}-${emptyIndex}`}
              style={{
                width: calculatedItemWidth,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
