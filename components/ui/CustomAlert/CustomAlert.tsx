import { ANIMATION } from '@/constants/animation';
import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { ThemedButton } from '../ThemedButton/ThemedButton';
import { ThemedCard } from '../ThemedCard/ThemedCard';
import { ThemedLanguageText } from '../ThemedLanguageText/ThemedLanguageText';

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
        };
      case 'error':
        return {
          iconColor: theme.status.error,
          borderColor: theme.status.error,
        };
      case 'warning':
        return {
          iconColor: theme.status.warning,
          borderColor: theme.status.warning,
        };
      case 'info':
        return {
          iconColor: theme.status.info,
          borderColor: theme.status.info,
        };
      default:
        return {
          iconColor: theme.text.primary,
          borderColor: theme.border.primary,
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
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
                  },
                ]}
              >
                {/* Header with icon and close button */}
                <View style={styles.header}>
                  <View style={styles.iconContainer}>
                    {getIcon() && (
                      <ThemedLanguageText
                        fontFamily="regional_secondary"
                        variant="primary"
                        size="large"
                        style={[
                          styles.icon,
                          { color: typeStyles.iconColor },
                        ]}
                      >
                        {getIcon()}
                      </ThemedLanguageText>
                    )}
                  </View>
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onDismiss}
                      style={styles.closeButton}
                    >
                      <ThemedLanguageText
                        fontFamily="regional_secondary"
                        variant="secondary"
                        size="medium"
                        style={[styles.closeButtonText, { color: theme.text.secondary }]}
                      >
                        ✕
                      </ThemedLanguageText>
                    </TouchableOpacity>
                  )}
                </View>

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

                {/* Buttons */}
                {buttons.length > 0 && (
                  <View style={styles.buttonContainer}>
                    {buttons.map((button, index) => (
                      <ThemedButton
                        key={index}
                        title={button.text}
                        onPress={() => handleButtonPress(button)}
                        variant={getButtonVariant(button.style || 'default')}
                        size="md"
                        style={StyleSheet.flatten([
                          styles.button,
                          index > 0 && styles.buttonSpacing,
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
    paddingHorizontal: SIZES.spacing.lg,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 400,
  },
  alertCard: {
    padding: SIZES.spacing.xl,
    margin: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
    lineHeight: 32,
  },
  message: {
    fontSize: SIZES.lg,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SIZES.spacing.sm,
  },
  button: {
    minWidth: 100,
  },
  buttonSpacing: {
    marginLeft: SIZES.spacing.sm,
  },
});

export default CustomAlert;
