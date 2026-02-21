import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';

interface ProActivationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProActivationModal: React.FC<ProActivationModalProps> = ({ visible, onClose }) => {
  const { width, height } = Dimensions.get('screen');
  const { refreshStatus } = useProStatus();
  const fonts = getLanguageFonts();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      iconScaleAnim.setValue(0);
      iconRotateAnim.setValue(0);

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
      await refreshStatus();
      onClose();
    });
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
        style={{
          position: 'absolute',
          width,
          height,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}
      >
        <TouchableWithoutFeedback onPress={() => { }}>
          <BlurView
            intensity={80}
            tint="dark"
            style={{ position: 'absolute', width, height }}
          >
            <Box
              className="absolute bg-black/60"
              style={{ width, height }}
            />
          </BlurView>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <Animated.View
            style={{
              maxWidth: width * 0.85,
              width: width * 0.85,
              borderRadius: 24,
              overflow: 'hidden',
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }}
          >
            <Box className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-700/50">
              <Box className="h-1.5 w-full bg-amber-500" />

              <Pressable
                onPress={handleClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800 items-center justify-center z-10 border border-neutral-700"
              >
                <Ionicons name="close" size={20} color="white" />
              </Pressable>

              <VStack className="items-center px-6 py-10 gap-5">
                <Animated.View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [
                      { scale: iconScaleAnim },
                      { rotate: iconRotation },
                    ],
                  }}
                >
                  <Box className="w-20 h-20 rounded-full bg-amber-500 items-center justify-center shadow-lg">
                    <Ionicons name="star" size={38} color="white" />
                  </Box>
                </Animated.View>

                <Text
                  className="text-white text-2xl font-black text-center shadow-sm"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('pro.activationTitle', { defaultValue: 'Pro Activated!' })}
                </Text>

                <Text
                  className="text-neutral-300 text-base text-center leading-6"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('pro.activationMessage', {
                    defaultValue:
                      'Congratulations! Your 1-day Pro membership is now active. Enjoy all Pro features!',
                  })}
                </Text>

                <HStack className="items-center px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 gap-3 w-full justify-center mt-2">
                  <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
                  <Text
                    className="text-amber-500 text-sm font-bold shadow-sm"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('pro.badgePreview', {
                      defaultValue: 'PRO badge is now active!',
                    })}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};
