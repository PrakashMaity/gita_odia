import { ViewStyle } from 'react-native';

export type GridVariant = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'card' | 'transparent';

export interface ThemedGridProps {
  /** Array of items to display in the grid */
  data: any[];
  /** Function to render each grid item */
  renderItem: (item: any, index: number) => React.ReactNode;
  /** Number of columns (1-4, defaults to 2) */
  numColumns?: 1 | 2 | 3 | 4;
  /** Grid variant for styling */
  variant?: GridVariant;
  /** Custom styles for the grid container */
  style?: ViewStyle | ViewStyle[];
  /** Custom styles for grid items */
  itemStyle?: ViewStyle | ViewStyle[];
  /** Gap between grid items */
  gap?: number;
  /** Key extractor function for items */
  keyExtractor?: (item: any, index: number) => string;
  /** Whether to center the grid items */
  centerItems?: boolean;
  /** Custom item width (if not provided, will be calculated based on numColumns) */
  itemWidth?: number;
}
