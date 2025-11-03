import { useTheme } from '@/hooks/useTheme';
import { useBookmarkStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Badge } from '../Badge';

interface BookmarkIconProps {
  size?: number;
  color?: string;
  focused?: boolean;
  showBadge?: boolean;
  badgeSize?: 'small' | 'medium' | 'large';
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  size = 24,
  color,
  focused = false,
  showBadge = true,
  badgeSize = 'small',
}) => {
  const { theme } = useTheme();
  const { getBookmarkCount } = useBookmarkStore();
  
  const bookmarkCount = getBookmarkCount();
  const iconColor = color || (focused ? theme.icon.primary : theme.icon.secondary);

  return (
    <View style={{ position: 'relative' }}>
      <Ionicons 
        name={focused ? 'bookmark' : 'bookmark-outline'} 
        size={size} 
        color={iconColor} 
      />
      {showBadge && bookmarkCount > 0 && (
        <Badge 
          count={bookmarkCount} 
          size={badgeSize}
          position="top-right"
        />
      )}
    </View>
  );
};
