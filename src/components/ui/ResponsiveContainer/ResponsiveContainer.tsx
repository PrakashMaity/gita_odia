import React from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
  horizontalPadding?: number;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  contentStyle,
  maxWidth,
  horizontalPadding,
}) => {
  const layout = useDeviceLayout();
  const resolvedPadding =
    horizontalPadding !== undefined ? horizontalPadding : layout.horizontalPadding;
  const resolvedMaxWidth = Math.min(
    maxWidth ?? layout.contentMaxWidth,
    layout.width,
  );

  return (
    <View style={[styles.outer, { paddingHorizontal: resolvedPadding }, style]}>
      <View style={[styles.inner, { maxWidth: resolvedMaxWidth }, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
  },
});


