import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface LockedCardWrapperProps {
  children: React.ReactNode;
  isLocked: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const LockedCardOverlay: React.FC<LockedCardWrapperProps> = ({ 
  children, 
  isLocked, 
  onPress,
  style 
}) => {
  const theme = useThemeColors();

  return (
    <View style={[styles.wrapper, style]}>
      {children}
      {isLocked && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={0.9}
          onPress={onPress}
        >
          <BlurView
          
            intensity={100}
            // tint="dark"
            style={styles.blurView}
          >
            <View style={[styles.darkOverlay]} />
            <View style={[styles.lockContainer, { backgroundColor: theme.background.secondary }]}>
              <Ionicons
                name="lock-closed"
                size={SIZES.icon.xxl}
                color={theme.icon.primary}
              />
            </View>
          </BlurView>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    borderRadius: SIZES.borderRadius.lg,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  lockContainer: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 11,
  },
});
