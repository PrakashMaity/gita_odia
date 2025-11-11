import { Theme } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useTheme';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type BackgroundVariant = keyof Theme['background'];

interface ThemedSafeAreaViewProps {
  children: React.ReactNode;
  variant?: BackgroundVariant;
}

function ThemedSafeAreaView({ children, variant = 'primary' }: ThemedSafeAreaViewProps) {
  const theme = useThemeColors();
  const backgroundColor = theme.background[variant];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      {children}
    </SafeAreaView>
  );
}

export default ThemedSafeAreaView;