import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from './ProUpgradeModal.styles';

interface ProUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ visible, onClose }) => {
  const theme = useThemeColors();
  const screenData = Dimensions.get('screen');
  const { width, height } = screenData;
  
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

  const handleClose = () => {
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
    ]).start(() => {
      onClose();
    });
  };

  const handleUpgrade = () => {
    handleClose();
    router.push('/subscription');
  };

  const handleBackdropPress = () => {
    // Allow closing by tapping backdrop
    handleClose();
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
                    name="lock-closed"
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
                {i18n.t('pro.upgradeTitle', { defaultValue: 'Upgrade to PRO' })}
              </ThemedLanguageText>

              {/* Message */}
              <ThemedLanguageText
                variant="secondary"
                size="large"
                fontFamily="regional_secondary"
                style={[styles.message, { color: theme.text.secondary }]}
              >
                {i18n.t('pro.upgradeMessage', { 
                  defaultValue: 'This content is available for PRO users only. Upgrade to PRO to unlock all premium features and access exclusive content!' 
                })}
              </ThemedLanguageText>

              {/* Benefits List */}
              <ThemedView style={styles.benefitsContainer}>
                <ThemedLanguageText
                  variant="primary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={[styles.benefitsTitle, { color: theme.text.primary }]}
                >
                  {i18n.t('pro.benefitsTitle', { defaultValue: 'PRO Features:' })}
                </ThemedLanguageText>
                {[
                  i18n.t('pro.benefit1', { defaultValue: 'Access to all premium content' }),
                  i18n.t('pro.benefit2', { defaultValue: 'Ad-free experience' }),
                  i18n.t('pro.benefit3', { defaultValue: 'Unlimited access to all features' }),
                ].map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={SIZES.icon.sm}
                      color={theme.status.success}
                      style={styles.benefitIcon}
                    />
                    <ThemedLanguageText
                      variant="secondary"
                      size="medium"
                      fontFamily="regional_secondary"
                      style={[styles.benefitText, { color: theme.text.secondary }]}
                    >
                      {benefit}
                    </ThemedLanguageText>
                  </View>
                ))}
              </ThemedView>

              {/* Upgrade Button */}
              <TouchableOpacity
                onPress={handleUpgrade}
                style={[
                  styles.upgradeButton,
                  { backgroundColor: theme.button.primary.background },
                ]}
                activeOpacity={0.8}
              >
                <ThemedLanguageText
                  variant="primary"
                  size="large"
                  fontFamily="regional_secondary"
                  style={[styles.upgradeButtonText, { color: theme.button.primary.text }]}
                >
                  {i18n.t('pro.upgradeButton', { defaultValue: 'Upgrade to PRO' })}
                </ThemedLanguageText>
                <Ionicons
                  name="arrow-forward"
                  size={SIZES.icon.md}
                  color={theme.button.primary.text}
                  style={styles.upgradeButtonIcon}
                />
              </TouchableOpacity>
            </ThemedView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};
