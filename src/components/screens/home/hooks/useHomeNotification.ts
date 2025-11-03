import { router } from 'expo-router';
import { useCallback } from 'react';
import { useNotificationStore } from '@/store';

/**
 * Custom hook for home screen notification operations
 * Follows Single Responsibility Principle - handles all notification-related logic
 */
export const useHomeNotification = () => {
  const {
    dailySloka,
    isNotificationVisible,
    hasNotification,
    setNotificationVisible,
  } = useNotificationStore();

  const handleNotificationClose = useCallback(() => {
    setNotificationVisible(false);
  }, [setNotificationVisible]);

  const handleReadMore = useCallback(() => {
    setNotificationVisible(false);

    if (dailySloka?.chapterId && dailySloka.chapterId !== 'unknown') {
      try {
        router.push(`/chapter/${dailySloka.chapterId}`);
      } catch (error) {
        console.error('Navigation error:', error);
        try {
          router.push('/(tabs)/chapters');
        } catch (fallbackError) {
          console.error('Fallback navigation error:', fallbackError);
        }
      }
    } else {
      try {
        router.push('/(tabs)/chapters');
      } catch (error) {
        console.error('Fallback navigation error:', error);
      }
    }
  }, [dailySloka, setNotificationVisible]);

  const handleBellPress = useCallback(() => {
    if (isNotificationVisible) {
      setNotificationVisible(false);
    } else if (hasNotification()) {
      setNotificationVisible(true);
    }
  }, [isNotificationVisible, hasNotification, setNotificationVisible]);

  return {
    handleNotificationClose,
    handleReadMore,
    handleBellPress,
  };
};

