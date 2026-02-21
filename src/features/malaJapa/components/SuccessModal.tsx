import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

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
  const fonts = getLanguageFonts();
  const { width: screenWidth } = Dimensions.get('screen');

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
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
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
            { opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.modalWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
              maxWidth: screenWidth * 0.85,
            },
          ]}
        >
          <Box className="bg-white rounded-[28px] border border-amber-200/60 overflow-hidden">
            {/* Top Accent */}
            <Box className="h-1.5 w-full bg-amber-500/80" />

            <VStack className="items-center px-8 py-10 gap-4">
              {/* Emoji */}
              <Text className="text-[56px]">✨</Text>

              {/* Title */}
              <Text
                className="text-[22px] font-black text-[#3E2723] text-center tracking-tight"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('malaJapa.completeMala')}
              </Text>

              {/* Completed Count */}
              <Text
                className="text-[17px] font-bold text-[#8D6E63] text-center"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {completedMalas} {i18n.t('malaJapa.completedMalas')}
              </Text>

              {/* Close Button */}
              <Pressable
                onPress={onClose}
                className="mt-3 bg-amber-600 rounded-2xl px-10 py-3 items-center justify-center active:opacity-80 shadow-sm"
              >
                <Text
                  className="text-white text-[15px] font-bold"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('common.ok')}
                </Text>
              </Pressable>
            </VStack>
          </Box>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalWrapper: {
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
});
