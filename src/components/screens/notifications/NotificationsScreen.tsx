import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, ScrollView } from 'react-native';
import { PageHeader } from '@/components/shared';
import { LayoutImages } from '@/utils/assets';
import { SIZES } from '@/rootconstants/sizes';
import { styles } from './NotificationsScreen.styles';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'update' | 'promotion' | 'reminder' | 'info';
  isRead: boolean;
}

// Static notification content for design
const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Feature: Daily Reading',
    message: 'Start your day with a verse from the Bhagavad Gita. Set daily reading reminders and track your progress.',
    time: '2 hours ago',
    type: 'update',
    isRead: false,
  },
  {
    id: '2',
    title: 'Special Offer: Premium Access',
    message: 'Unlock all translations, audio features, and exclusive content. Limited time offer - 50% off!',
    time: '5 hours ago',
    type: 'promotion',
    isRead: false,
  },
  {
    id: '3',
    title: 'New Translation Added',
    message: 'We have added a new translation in your preferred language. Check it out in the Translations section.',
    time: '1 day ago',
    type: 'update',
    isRead: true,
  },
  {
    id: '4',
    title: 'Daily Reading Reminder',
    message: "Don't forget to read today's verse from Chapter 2, Verse 47. Your progress is waiting!",
    time: '2 days ago',
    type: 'reminder',
    isRead: true,
  },
  {
    id: '5',
    title: 'App Update Available',
    message: 'A new version of the app is available with bug fixes and performance improvements.',
    time: '3 days ago',
    type: 'info',
    isRead: true,
  },
  {
    id: '6',
    title: 'Weekly Progress Summary',
    message: 'You have read 15 verses this week. Keep up the great work on your spiritual journey!',
    time: '1 week ago',
    type: 'info',
    isRead: true,
  },
];

const getNotificationIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'update':
      return 'notifications';
    case 'promotion':
      return 'gift';
    case 'reminder':
      return 'time';
    case 'info':
      return 'information-circle';
    default:
      return 'notifications';
  }
};

const getNotificationColor = (type: NotificationItem['type'], theme: ReturnType<typeof useThemeColors>) => {
  switch (type) {
    case 'update':
      return theme.icon.primary;
    case 'promotion':
      return theme.icon.secondary;
    case 'reminder':
      return theme.icon.tertiary;
    case 'info':
      return theme.icon.primary;
    default:
      return theme.icon.primary;
  }
};

export const NotificationsScreen: React.FC = () => {
  const theme = useThemeColors();

  const renderNotificationItem = (item: NotificationItem) => {
    const iconName = getNotificationIcon(item.type);
    const iconColor = getNotificationColor(item.type, theme);

    return (
      <ThemedView
        key={item.id}
        variant="card"
        style={[
          styles.notificationItem,
          {
            backgroundColor: item.isRead 
              ? theme.background.card 
              : theme.background.quaternary,
            borderColor: item.isRead 
              ? theme.border.secondary 
              : theme.border.primary,
            borderLeftWidth: item.isRead ? 1 : 4,
          },
        ]}
      >
        <ThemedView style={styles.itemHeader}>
          <ThemedView style={styles.iconContainer}>
            <Ionicons
              name={iconName}
              size={SIZES.icon.lg}
              color={iconColor}
            />
          </ThemedView>
          <ThemedView style={styles.contentContainer}>
            <ThemedView style={styles.titleRow}>
              <ThemedLanguageText
                variant="primary"
                size="lg"
                fontFamily="regional_secondary"
                style={[
                  styles.itemTitle,
                  { fontWeight: item.isRead ? '500' : 'bold' },
                ]}
              >
                {item.title}
              </ThemedLanguageText>
              {!item.isRead && (
                <ThemedView
                  style={[
                    styles.unreadDot,
                    { backgroundColor: theme.background.tertiary },
                  ]}
                />
              )}
            </ThemedView>
            <ThemedLanguageText
              variant="secondary"
              size="md"
              fontFamily="regional_secondary"
              style={styles.itemMessage}
            >
              {item.message}
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="secondary"
              size="sm"
              fontFamily="regional_secondary"
              style={styles.itemTime}
            >
              {item.time}
            </ThemedLanguageText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <ImageBackground
      source={LayoutImages.background2}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <PageHeader title="Notifications" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.notificationsList}>
            {notifications.map(renderNotificationItem)}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

