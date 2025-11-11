import { useBookmarkStore } from '@/store';
import { Image, View } from 'react-native';
import { Badge } from '../Badge';

interface BookmarkIconProps {
  size?: number;
  focused?: boolean;
  showBadge?: boolean;
  badgeSize?: 'small' | 'medium' | 'large';
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  size = 24,
  focused = false,
  showBadge = true,
  badgeSize = 'small',
}) => {
  const { getBookmarkCount } = useBookmarkStore();

  const bookmarkCount = getBookmarkCount();
  const iconSource = require('@/assets/images/menu/bookmark-active.png');

  return (
    <View style={{ position: 'relative' }}>
      <Image
        source={iconSource}
        style={{
          width: size,
          height: size,
          opacity: focused ? 1 : 0.75,
        }}
        resizeMode="contain"
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
