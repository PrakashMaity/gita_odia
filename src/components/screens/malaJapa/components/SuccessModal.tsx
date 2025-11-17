import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';
import { ANIMATION } from '@/constants/animation';

interface SuccessModalProps {
  visible: boolean;
  completedMalas: number;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  completedMalas,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION.normal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, fadeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.overlayBackground,
            {
              opacity: fadeAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.content}>
            <ThemedLanguageText
              variant="primary"
              size="title"
              style={styles.successIcon}
            >
              ✨
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="primary"
              size="title"
              style={styles.successTitle}
              fontFamily="regional_secondary"
            >
              {i18n.t('malaJapa.completeMala')}
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="secondary"
              size="large"
              style={styles.successMessage}
              fontFamily="regional_secondary"
            >
              {completedMalas} {i18n.t('malaJapa.completedMalas')}
            </ThemedLanguageText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <ThemedLanguageText
                variant="primary"
                size="medium"
                style={styles.closeButtonText}
                fontFamily="regional_secondary"
              >
                {i18n.t('common.ok')}
              </ThemedLanguageText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF8E1',
    borderRadius: SIZES.radius.xl,
    padding: SIZES.spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FF8F00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minWidth: 280,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: SIZES.spacing.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: SIZES.spacing.sm,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: '#5D4037',
    marginBottom: SIZES.spacing.xl,
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#FF8F00',
    paddingVertical: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.xl,
    borderRadius: SIZES.radius.lg,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E65100',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

