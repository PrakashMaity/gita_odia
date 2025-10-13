import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  count: number;
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showZero?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  maxCount = 99,
  size = 'small',
  position = 'top-right',
  showZero = false,
}) => {
  const { theme } = useTheme();

  // Don't show badge if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return {
          width: 16,
          height: 16,
          fontSize: 10,
          borderRadius: 8,
        };
      case 'medium':
        return {
          width: 20,
          height: 20,
          fontSize: 12,
          borderRadius: 10,
        };
      case 'large':
        return {
          width: 24,
          height: 24,
          fontSize: 14,
          borderRadius: 12,
        };
      default:
        return {
          width: 16,
          height: 16,
          fontSize: 10,
          borderRadius: 8,
        };
    }
  };

  const getPosition = () => {
    const badgeSize = getBadgeSize();
    switch (position) {
      case 'top-right':
        return {
          top: -badgeSize.height / 2,
          right: -badgeSize.width / 2,
        };
      case 'top-left':
        return {
          top: -badgeSize.height / 2,
          left: -badgeSize.width / 2,
        };
      case 'bottom-right':
        return {
          bottom: -badgeSize.height / 2,
          right: -badgeSize.width / 2,
        };
      case 'bottom-left':
        return {
          bottom: -badgeSize.height / 2,
          left: -badgeSize.width / 2,
        };
      default:
        return {
          top: -badgeSize.height / 2,
          right: -badgeSize.width / 2,
        };
    }
  };

  const badgeSize = getBadgeSize();
  const positionStyle = getPosition();

  return (
    <View
      style={[
        styles.badge,
        {
          width: badgeSize.width,
          height: badgeSize.height,
          borderRadius: badgeSize.borderRadius,
          backgroundColor: theme.status.info,
          ...positionStyle,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            fontSize: badgeSize.fontSize,
            color: theme.text.primary,
          },
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
