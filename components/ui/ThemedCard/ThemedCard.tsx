import { TouchableOpacity, ViewStyle } from 'react-native';
import { SIZES } from '../../../constants/sizes';
import { Z_INDEX } from '../../../constants/zIndex';
import { useThemeColors } from '../../../hooks/useTheme';
import { ThemedView } from '../ThemedView/ThemedView';
import { patternComponents } from './patterns/SvgPatterns';
import { ThemedCardProps } from './types';

export type CardVariant = 'primary' | 'secondary' | 'card' | 'transparent';



export const ThemedCard: React.FC<ThemedCardProps> = ({
  variant = 'primary',
  style,
  children,
  borderVariant = 'none',
  onPress,
  activeOpacity = 0.7,
  pattern = 'none',
  patternOpacity = 0.1,
  ...props
}) => {
  const theme = useThemeColors();

  const getCardStyle = (): ViewStyle | ViewStyle[] => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.card.borderRadius,
      padding: SIZES.card.padding,
      margin: SIZES.card.margin,
      zIndex: Z_INDEX.card,
      borderWidth:borderVariant === 'none' ? 0 : SIZES.borderSize.lg,
      borderColor:borderVariant === 'none' ? 'transparent' : theme.border[borderVariant],
      overflow: 'hidden', // Prevent pattern overflow
    };

    // Variant styles
    const variantStyles: Record<CardVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.background.secondary,
       
      },
      secondary: {
        backgroundColor: theme.background.primary,
       
      },
      card: {
        backgroundColor: theme.background.card,
       
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

  const cardStyle = getCardStyle();

  // Get pattern colors based on theme
  const getPatternColors = () => {
    return {
      color1: theme.icon.primary,
      color2: theme.icon.secondary,
    };
  };

  // Only calculate pattern colors and component if pattern is needed
  const shouldRenderPattern = pattern && pattern !== 'none';
  const patternColors = shouldRenderPattern ? getPatternColors() : null;
  const PatternComponent = shouldRenderPattern ? patternComponents[pattern] : null;

  const renderPattern = () => {
    // Only render pattern if explicitly requested and not 'none'
    if (!shouldRenderPattern || !PatternComponent) return null;
    
    return (
      <PatternComponent
        width={400}
        height={200}
        color1={patternColors!.color1}
        color2={patternColors!.color2}
        opacity={patternOpacity}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    );
  };

  if (onPress) {
    const { onBlur, onFocus, ...touchableProps } = props;
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={[cardStyle, { position: 'relative' }]}
        {...touchableProps}
      >
        {renderPattern()}
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <ThemedView variant='primary' style={Array.isArray(cardStyle) ? [...cardStyle, { position: 'relative' }] : [cardStyle, { position: 'relative' }]} {...props}>
      {renderPattern()}
      {children}
    </ThemedView>
  );
};

