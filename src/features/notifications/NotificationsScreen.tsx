import { PageHeader } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { LayoutImages } from '@/lib/utils/assets';
import { fetchNotifications, type NotificationItem } from '@/services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView } from 'react-native';

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

const getNotificationColorClass = (type: NotificationItem['type']) => {
  switch (type) {
    case 'update':
      return 'text-primary-950';
    case 'promotion':
      return 'text-primary-600';
    case 'reminder':
      return 'text-primary-500';
    case 'info':
      return 'text-primary-950';
    default:
      return 'text-primary-950';
  }
};

export const NotificationsScreen: React.FC = () => {
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

    return (
      <Box
        key={item.id}
        className={`mb-4 rounded-3xl p-6 border ${item.isRead
          ? 'bg-white border-primary-200 shadow-sm'
          : 'bg-primary-50 border-primary-200 border-l-4 shadow-sm'
          }`}
      >
        <Box className="flex-row">
          <Box className="w-12 h-12 rounded-full items-center justify-center mr-4 bg-primary-100">
            <Ionicons
              name={iconName}
              size={24}
              color={item.isRead ? '#9ca3af' : '#0f172a'}
            />
          </Box>
          <Box className="flex-1">
            <Box className="flex-row justify-between items-start mb-1">
              <Text
                className={`flex-1 text-lg font-regional_secondary ${item.isRead ? 'font-medium text-primary-600' : 'font-bold text-primary-950'
                  }`}
              >
                {item.title}
              </Text>
              {!item.isRead && (
                <Box className="w-2 h-2 rounded-full bg-primary-950 ml-2 mt-2" />
              )}
            </Box>
            <Text className="text-sm leading-5 mb-2 font-regional_secondary text-primary-600">
              {item.message}
            </Text>
            <Text className="text-xs font-regional_secondary text-primary-500">
              {item.time}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <ImageBackground
      source={LayoutImages.background2}
      className="flex-1 w-full"
      resizeMode="cover"
      blurRadius={2.5}
    >
      <Box className="flex-1 bg-white/80">
        <PageHeader title="Notifications" />

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-16"
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <Box className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text className="text-base mt-4 text-primary-600 font-regional_secondary">
                Loading notifications...
              </Text>
            </Box>
          ) : (
            <Box className="pt-4">
              {notifications.length > 0 ? (
                notifications.map(renderNotificationItem)
              ) : (
                <Box className="flex-1 justify-center items-center py-20">
                  <Ionicons name="notifications-off" size={64} color="#94a3b8" />
                  <Text className="text-lg mt-4 text-primary-600 font-regional_secondary text-center">
                    No notifications available
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </ScrollView>
      </Box>
    </ImageBackground>
  );
};

