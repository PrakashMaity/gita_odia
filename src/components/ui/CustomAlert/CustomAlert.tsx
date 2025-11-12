import { ANIMATION } from '@/constants/animation';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Platform,
} from 'react-native';
import { ThemedButton } from '../ThemedButton/ThemedButton';
import { ThemedCard } from '../ThemedCard/ThemedCard';
import { ThemedLanguageText } from '../ThemedLanguageText/ThemedLanguageText';
import Feather from '@expo/vector-icons/Feather';

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
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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
          toValue: 0.8,
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
          borderColor: theme.status.success,
          backgroundColor: `${theme.status.success}15`,
          iconBackground: `${theme.status.success}20`,
        };
      case 'error':
        return {
          iconColor: theme.status.error,
          borderColor: theme.status.error,
          backgroundColor: `${theme.status.error}15`,
          iconBackground: `${theme.status.error}20`,
        };
      case 'warning':
        return {
          iconColor: theme.status.warning,
          borderColor: theme.status.warning,
          backgroundColor: `${theme.status.warning}15`,
          iconBackground: `${theme.status.warning}20`,
        };
      case 'info':
        return {
          iconColor: theme.status.info,
          borderColor: theme.status.info,
          backgroundColor: `${theme.status.info}15`,
          iconBackground: `${theme.status.info}20`,
        };
      default:
        return {
          iconColor: theme.icon.primary,
          borderColor: theme.border.primary,
          backgroundColor: `${theme.background.primary}30`,
          iconBackground: `${theme.background.primary}20`,
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

  const getButtonVariant = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return 'secondary';
      case 'cancel':
        return 'outline';
      default:
        return 'primary';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
        return 'info';
      default:
        return 'alert-circle';
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
              <ThemedCard
                variant="card"
                style={[
                  styles.alertCard,
                  {
                    borderColor: typeStyles.borderColor,
                    borderWidth: 2,
                    backgroundColor: theme.background.card,
                  },
                ]}
              >
                {/* Header with close button */}
                {showCloseButton && (
                  <View style={styles.headerContainer}>
                    <TouchableOpacity
                      onPress={onDismiss}
                      style={styles.closeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Feather
                        name="x"
                        size={SIZES.icon.md}
                        color={theme.text.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Icon Container - Centered */}
                {getIcon() && (
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: typeStyles.iconBackground },
                  ]}>
                    <Feather
                      name={getIcon() as any}
                      size={SIZES.icon.xxl}
                      color={typeStyles.iconColor}
                    />
                  </View>
                )}

                {/* Content Container */}
                <View style={styles.contentContainer}>
                  {/* Title */}
                  {title && (
                    <ThemedLanguageText
                      fontFamily="regional_secondary"
                      variant="primary"
                      size="title"
                      style={[
                        styles.title,
                        { color: theme.text.primary },
                      ]}
                    >
                      {title}
                    </ThemedLanguageText>
                  )}

                  {/* Message */}
                  {message && (
                    <ThemedLanguageText
                      fontFamily="regional_secondary"
                      variant="secondary"
                      size="large"
                      style={[
                        styles.message,
                        { color: theme.text.secondary },
                      ]}
                    >
                      {message}
                    </ThemedLanguageText>
                  )}
                </View>

                {/* Buttons */}
                {buttons.length > 0 && (
                  <View style={[
                    styles.buttonContainer,
                    buttons.length > 1 && styles.buttonContainerMultiple,
                  ]}>
                    {buttons.map((button, index) => (
                      <ThemedButton
                        key={index}
                        title={button.text}
                        onPress={() => handleButtonPress(button)}
                        variant={getButtonVariant(button.style || 'default')}
                        size="md"
                        style={StyleSheet.flatten([
                          styles.button,
                          buttons.length === 1 && styles.buttonFullWidth,
                          buttons.length > 1 && index > 0 && styles.buttonSpacing,
                        ])}
                      />
                    ))}
                  </View>
                )}
              </ThemedCard>
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
  alertCard: {
    width: '100%',
    paddingTop: SIZES.spacing.xl,
    paddingBottom: SIZES.spacing.xxl,
    paddingHorizontal: SIZES.spacing.xxl,
    margin: 0,
    borderRadius: SIZES.radius.xl,
    position: 'relative',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  headerContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: SIZES.spacing.xs,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    marginTop: SIZES.spacing.xs,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SIZES.spacing.md,
    lineHeight: 36,
    letterSpacing: 0.3,
    width: '100%',
  },
  message: {
    fontSize: SIZES.lg,
    textAlign: 'center',
    lineHeight: 26,
    width: '100%',
    paddingHorizontal: SIZES.spacing.xs,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: SIZES.spacing.md,
    marginTop: SIZES.spacing.md,
  },
  buttonContainerMultiple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.spacing.md,
  },
  button: {
    minHeight: 44,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonSpacing: {
    marginLeft: 0,
  },
});

export default CustomAlert;
