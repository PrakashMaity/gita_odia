import { styles } from '@/features/home/components/ProActivationModal/ProActivationModal.styles';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface ProActivationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProActivationModal: React.FC<ProActivationModalProps> = ({ visible, onClose }) => {
  const theme = useThemeColors();
  const screenData = Dimensions.get('screen');
  const { width, height } = screenData;
  const { refreshStatus } = useProStatus();
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      iconScaleAnim.setValue(0);
      iconRotateAnim.setValue(0);

      // Animate modal entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.spring(iconScaleAnim, {
            toValue: 1,
            tension: 40,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(iconRotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(iconRotateAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          ),
        ]),
      ]).start();
    }
  }, [visible, scaleAnim, fadeAnim, iconScaleAnim, iconRotateAnim]);

  const handleClose = async () => {
    // Animate exit
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      // Refresh Pro status to update the badge
      await refreshStatus();
      onClose();
    });
  };

  const handleBackdropPress = () => {
    // Don't allow closing by tapping backdrop
    // User must click the close button
  };

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[
          styles.backdrop, 
          { 
            width, 
            height,
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <BlurView
            intensity={80}
            tint="dark"
            style={[styles.backdropTouchable, { width, height }]}
          >
            <View style={[styles.blurOverlay, { width, height, backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} />
          </BlurView>
        </TouchableWithoutFeedback>
        
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.background.secondary,
                maxWidth: width * 0.85,
                width: width * 0.85,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: SIZES.shadow.xl,
                },
                shadowOpacity: 0.4,
                shadowRadius: SIZES.shadow.lg,
                elevation: 20,
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            {/* Decorative Top Border */}
            <View
              style={[
                styles.decorativeBorder,
                { backgroundColor: theme.button.primary.background },
              ]}
            />

            {/* Close Button */}
            <TouchableOpacity
              onPress={handleClose}
              style={[
                styles.closeButton,
                { backgroundColor: theme.background.tertiary },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={SIZES.icon.md}
                color={theme.icon.primary}
              />
            </TouchableOpacity>

            {/* Content */}
            <ThemedView style={styles.content}>
              {/* Icon with Animation */}
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.button.primary.background,
                    transform: [
                      { scale: iconScaleAnim },
                      { rotate: iconRotation },
                    ],
                  },
                ]}
              >
                <View style={styles.iconGlow}>
                  <Ionicons
                    name="star"
                    size={SIZES.icon.xxl}
                    color={theme.button.primary.text}
                  />
                </View>
                <View style={[styles.iconRing, { borderColor: theme.button.primary.background }]} />
              </Animated.View>

              {/* Title */}
              <ThemedLanguageText
                variant="primary"
                size="title"
                fontFamily="regional_secondary"
                style={[styles.title, { color: theme.text.primary }]}
              >
                {i18n.t('pro.activationTitle', { defaultValue: 'Pro Activated!' })}
              </ThemedLanguageText>

              {/* Message */}
              <ThemedLanguageText
                variant="secondary"
                size="large"
                fontFamily="regional_secondary"
                style={[styles.message, { color: theme.text.secondary }]}
              >
                {i18n.t('pro.activationMessage', { 
                  defaultValue: 'Congratulations! Your 1-day Pro membership is now active. Enjoy all Pro features!' 
                })}
              </ThemedLanguageText>

              {/* Pro Badge Preview */}
              <ThemedView
                style={[
                  styles.proBadgePreview,
                  { 
                    backgroundColor: theme.button.primary.background + '20',
                    borderColor: theme.button.primary.background,
                  },
                ]}
              >
                <View style={styles.badgeIconContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={SIZES.icon.md}
                    color={theme.button.primary.background}
                  />
                </View>
                <ThemedLanguageText
                  variant="primary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={[styles.proBadgePreviewText, { color: theme.text.primary }]}
                >
                  {i18n.t('pro.badgePreview', { defaultValue: 'Look for the PRO badge on your home screen!' })}
                </ThemedLanguageText>
              </ThemedView>
            </ThemedView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};
