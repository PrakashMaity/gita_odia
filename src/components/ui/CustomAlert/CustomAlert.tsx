import { ANIMATION } from '@/constants/animation';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { AppText } from '../AppText';
import { Box } from '../box';
import { Heading } from '../heading';
import { Pressable } from '../pressable';
import { Text } from '../text';
import { VStack } from '../vstack';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
  type = 'default',
  showCloseButton = true,
}) => {
  const theme = useThemeColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: theme.status.success,
          accentColor: theme.status.success,
          iconName: 'check-circle' as const,
          bgIcon: 'check-circle' as const,
        };
      case 'error':
        return {
          iconColor: theme.status.error,
          accentColor: theme.status.error,
          iconName: 'x-circle' as const,
          bgIcon: 'error' as const,
        };
      case 'warning':
        return {
          iconColor: theme.status.warning,
          accentColor: theme.status.warning,
          iconName: 'alert-triangle' as const,
          bgIcon: 'warning' as const,
        };
      case 'info':
        return {
          iconColor: theme.status.info,
          accentColor: theme.status.info,
          iconName: 'info' as const,
          bgIcon: 'info' as const,
        };
      default:
        return {
          iconColor: theme.icon.primary,
          accentColor: theme.border.primary,
          iconName: 'alert-circle' as const,
          bgIcon: 'help' as const,
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleBackdropPress = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.alertContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Box
                className="w-full rounded-[32px] overflow-hidden shadow-2xl relative"
                style={{ backgroundColor: theme.background.primary }}
              >
                {/* Top Accent Bar */}
                <Box
                  className="h-1.5 w-full"
                  style={{ backgroundColor: typeStyles.accentColor }}
                />

                {/* Background Decorative Icon */}
                <Box
                  className="absolute -right-10 -top-10 opacity-[0.03]"
                  pointerEvents="none"
                >
                  <MaterialIcons
                    name={typeStyles.bgIcon}
                    size={200}
                    color="#000"
                  />
                </Box>

                <VStack className="p-8 items-center">
                  {/* Close Button */}
                  {showCloseButton && (
                    <Box className="absolute right-4 top-4">
                      <Pressable
                        onPress={onDismiss}
                        className="w-10 h-10 rounded-full items-center justify-center bg-black/5 active:opacity-60"
                      >
                        <Feather
                          name="x"
                          size={20}
                          color={theme.text.secondary}
                        />
                      </Pressable>
                    </Box>
                  )}

                  {/* Icon Container */}
                  <Box
                    className="w-20 h-20 rounded-[24px] items-center justify-center mb-6"
                    style={{ backgroundColor: typeStyles.accentColor + '15' }}
                  >
                    <Feather
                      name={typeStyles.iconName}
                      size={40}
                      color={typeStyles.iconColor}
                    />
                  </Box>

                  {/* Title */}
                  {title && (
                    <Heading
                      className="text-[24px] font-black text-center mb-3 tracking-tight"
                      style={{ color: theme.text.primary }}
                    >
                      {title}
                    </Heading>
                  )}

                  {/* Message */}
                  {message && (
                    <Text
                      className="text-[16px] font-medium text-center leading-6 mb-8 px-2"
                      style={{ color: theme.text.secondary }}
                    >
                      {message}
                    </Text>
                  )}

                  {/* Buttons */}
                  <VStack
                    className="w-full"
                    space="md"
                    style={{ alignSelf: 'stretch' }}
                  >
                    {buttons.map((button, index) => {
                      const isCancel = button.style === 'cancel';
                      const isDestructive = button.style === 'destructive';
                      const bgColor = isCancel
                        ? 'transparent'
                        : (isDestructive ? theme.status.error : typeStyles.accentColor);
                      const bColor = isCancel ? theme.border.primary + '30' : 'transparent';

                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.8}
                          onPress={() => handleButtonPress(button)}
                          className="w-full h-14 rounded-[20px] items-center justify-center"
                          style={{
                            backgroundColor: bgColor,
                            borderWidth: 1,
                            borderColor: bColor,
                          }}
                        >
                          <AppText
                            variant="secondary"
                            className="font-bold text-lg"
                            style={{ color: isCancel ? theme.text.secondary : '#FFFFFF' }}
                          >
                            {button.text}
                          </AppText>
                        </TouchableOpacity>
                      );
                    })}
                  </VStack>
                </VStack>
              </Box>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  alertContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
});

export default CustomAlert;
