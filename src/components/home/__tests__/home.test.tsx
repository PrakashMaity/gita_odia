import { useNotificationStore } from '@/store';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Home from '../home';

// Mock the store
jest.mock('@/store', () => ({
  useNotificationStore: jest.fn(),
}));

// Mock other dependencies
jest.mock('@/hooks/useTheme', () => ({
  useThemeColors: () => ({
    border: { primary: '#000' },
    button: { primary: { background: '#000', text: '#fff' } },
    icon: { primary: '#000' },
    status: { warning: '#ff0', error: '#f00' },
  }),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Home Component - Notification Feature', () => {
  const mockSetNotificationVisible = jest.fn();
  const mockSetDailySloka = jest.fn();
  const mockShouldShowNewNotification = jest.fn();
  const mockHasNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNotificationStore as jest.Mock).mockReturnValue({
      dailySloka: {
        id: 'test-id',
        chapterId: 'test-chapter-id',
        chapterNumber: '১',
        verseNumber: '১',
        Language: 'Test sloka',
        translation: 'Test translation',
        speaker: 'Test speaker',
        date: '2024-01-01',
      },
      isNotificationVisible: false,
      shouldShowNewNotification: mockShouldShowNewNotification,
      hasNotification: mockHasNotification,
      setDailySloka: mockSetDailySloka,
      setNotificationVisible: mockSetNotificationVisible,
    });
  });

  test('bell icon should be clickable', () => {
    mockHasNotification.mockReturnValue(true);
    
    const { getByTestId } = render(<Home />);
    const bellIcon = getByTestId('bell-icon');
    
    expect(bellIcon).toBeTruthy();
  });

  test('should call setNotificationVisible when bell is pressed and has notification', () => {
    mockHasNotification.mockReturnValue(true);
    
    const { getByTestId } = render(<Home />);
    const bellIcon = getByTestId('bell-icon');
    
    fireEvent.press(bellIcon);
    
    expect(mockSetNotificationVisible).toHaveBeenCalledWith(true);
  });

  test('should hide notification when bell is pressed and notification is visible', () => {
    (useNotificationStore as jest.Mock).mockReturnValue({
      dailySloka: {
        id: 'test-id',
        chapterId: 'test-chapter-id',
        chapterNumber: '১',
        verseNumber: '১',
        Language: 'Test sloka',
        translation: 'Test translation',
        speaker: 'Test speaker',
        date: '2024-01-01',
      },
      isNotificationVisible: true,
      shouldShowNewNotification: mockShouldShowNewNotification,
      hasNotification: mockHasNotification,
      setDailySloka: mockSetDailySloka,
      setNotificationVisible: mockSetNotificationVisible,
    });
    
    mockHasNotification.mockReturnValue(true);
    
    const { getByTestId } = render(<Home />);
    const bellIcon = getByTestId('bell-icon');
    
    fireEvent.press(bellIcon);
    
    expect(mockSetNotificationVisible).toHaveBeenCalledWith(false);
  });
});
