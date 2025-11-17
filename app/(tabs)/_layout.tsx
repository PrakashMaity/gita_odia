import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, View } from 'react-native';

export default function TabLayout() {
  const { theme } = useTheme();
  const ACTIVE_ICON_SIZE = SIZES.icon.huge;
  const INACTIVE_ICON_SIZE = SIZES.icon.xxl;
  const ACTIVE_WRAPPER_SIZE = ACTIVE_ICON_SIZE + SIZES.spacing.md;

  const renderMenuIcon = (iconSource: ImageSourcePropType) => {
    const MenuIcon = ({ focused }: { focused: boolean }) => {
      const isActive = focused;
      const wrapperSize = isActive ? ACTIVE_WRAPPER_SIZE : INACTIVE_ICON_SIZE;

      return (
        <View
          style={{
            width: wrapperSize,
            height: wrapperSize,
            borderRadius: wrapperSize / 2,
            backgroundColor: isActive ? theme.background.secondary : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={iconSource}
            style={{
              width: isActive ? ACTIVE_ICON_SIZE : INACTIVE_ICON_SIZE,
              height: isActive ? ACTIVE_ICON_SIZE : INACTIVE_ICON_SIZE,
              opacity: isActive ? 1 : 0.75,
            }}
            resizeMode="contain"
          />
        </View>
      );
    };

    MenuIcon.displayName = 'MenuIcon';

    return MenuIcon;
  };

  return (
    <ErrorBoundary>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.icon.primary,
          tabBarInactiveTintColor: theme.text.secondary,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme.background.primary,
            borderTopColor: theme.border.primary,
            borderTopWidth: SIZES.borderSize.md,
            height: ACTIVE_WRAPPER_SIZE + SIZES.spacing.lg,
            paddingBottom: SIZES.spacing.sm,
            paddingTop: SIZES.spacing.sm,
          },
          tabBarIconStyle: {
            width: ACTIVE_ICON_SIZE,
            height: ACTIVE_ICON_SIZE,
          },
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          headerShown: false,
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('tabs.home'),
          tabBarIcon: renderMenuIcon(
            require('@/assets/images/menu/home-active.png')
          ),
        }}
      />
      <Tabs.Screen
        name="chapters"
        options={{
          title: i18n.t('tabs.chapters'),
          tabBarIcon: renderMenuIcon(
            require('@/assets/images/menu/chapter-active.png')
          ),
        }}
      />
  
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: i18n.t('tabs.bookmarks'),
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: focused ? ACTIVE_WRAPPER_SIZE : INACTIVE_ICON_SIZE,
                height: focused ? ACTIVE_WRAPPER_SIZE : INACTIVE_ICON_SIZE,
                borderRadius: (focused ? ACTIVE_WRAPPER_SIZE : INACTIVE_ICON_SIZE) / 2,
                backgroundColor: focused ? theme.background.secondary : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookmarkIcon
                size={focused ? ACTIVE_ICON_SIZE : INACTIVE_ICON_SIZE}
                focused={focused}
                showBadge={false}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: i18n.t('tabs.profile'),
          tabBarIcon: renderMenuIcon(
            require('@/assets/images/menu/settings-active.png')
          ),
        }}
      />
    </Tabs>
    </ErrorBoundary>
  );
}
