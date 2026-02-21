import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import { PageHeader } from '@/components/shared';
import { LayoutImages } from '@/lib/utils/assets';
import { SIZES } from '@/rootconstants/sizes';
import { styles } from './NotificationsScreen.styles';
import { useEffect, useState } from 'react';
import { fetchNotifications, type NotificationItem } from '@/services/notificationService';

// Fallback static notification content (used when no notifications are available)
const fallbackNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Welcome to Gita',
    message: 'Start your spiritual journey with the Bhagavad Gita. Explore chapters, verses, and translations.',
    time: 'Just now',
    type: 'info',
    isRead: false,
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications when component mounts
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedNotifications = await fetchNotifications();
        
        // Use fetched notifications or fallback if empty
        if (fetchedNotifications.length > 0) {
          setNotifications(fetchedNotifications);
        } else {
          setNotifications(fallbackNotifications);
        }
      } catch (err) {
        console.error('Error loading notifications:', err);
        setError('Failed to load notifications');
        // Use fallback notifications on error
        setNotifications(fallbackNotifications);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

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
                size="large"
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
              size="medium"
              fontFamily="regional_secondary"
              style={styles.itemMessage}
            >
              {item.message}
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="secondary"
              size="small"
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
          refreshControl={
            // Add pull-to-refresh functionality
            undefined // Can be enhanced with RefreshControl if needed
          }
        >
          {loading ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.icon.primary} />
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.loadingText}
              >
                Loading notifications...
              </ThemedLanguageText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.notificationsList}>
              {notifications.length > 0 ? (
                notifications.map(renderNotificationItem)
              ) : (
                <ThemedView style={styles.emptyContainer}>
                  <Ionicons name="notifications-off" size={SIZES.icon.xl} color={theme.icon.secondary} />
                  <ThemedLanguageText
                    variant="secondary"
                    size="medium"
                    fontFamily="regional_secondary"
                    style={styles.emptyText}
                  >
                    No notifications available
                  </ThemedLanguageText>
                </ThemedView>
              )}
            </ThemedView>
          )}
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

