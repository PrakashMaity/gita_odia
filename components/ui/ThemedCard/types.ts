import { ViewProps, ViewStyle } from "react-native";
import { CardVariant } from "./ThemedCard";
import { PatternType } from "./patterns/SvgPatterns";

export interface ThemedCardProps extends ViewProps {
    variant?: CardVariant;
    style?: ViewStyle | ViewStyle[];
    children: React.ReactNode;
    borderVariant?: 'none' | 'primary' | 'secondary';
    onPress?: () => void;
    activeOpacity?: number;
    pattern?: PatternType;
    patternOpacity?: number;
  }