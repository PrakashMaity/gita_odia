  import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { FONTS_LANGUAGE } from '@/interface/font.interface';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.icon.primary,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.background.primary,
          borderTopColor: theme.border.primary,
          borderTopWidth: SIZES.borderSize.md,
          height: SIZES.header.lg,
          paddingBottom: SIZES.spacing.sm,
          paddingTop: SIZES.spacing.sm,
          
        },
        tabBarLabelStyle: {
          fontSize: SIZES.lg,
          fontFamily: FONTS_LANGUAGE.regional_secondary,
          
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('tabs.home'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chapters"
        options={{
          title: i18n.t('tabs.chapters'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'list' : 'list-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
  
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: i18n.t('tabs.bookmarks'),
          tabBarIcon: ({ color, size, focused }) => (
            <BookmarkIcon 
              size={size} 
              color={color} 
              focused={focused}
              showBadge={true}
              badgeSize="small"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: i18n.t('tabs.profile'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
