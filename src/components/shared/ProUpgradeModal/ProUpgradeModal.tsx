import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, TouchableWithoutFeedback } from 'react-native';

interface ProUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ visible, onClose }) => {
  const theme = useThemeColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (!visible) return;

    fadeAnim.setValue(0);
    translateYAnim.setValue(24);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, fadeAnim, translateYAnim]);

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 24,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  const handleUpgrade = () => {
    closeWithAnimation();
    setTimeout(() => {
      router.push('/subscription');
    }, 120);
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={closeWithAnimation}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <TouchableWithoutFeedback onPress={closeWithAnimation}>
          <BlurView intensity={80} tint="dark" style={{ flex: 1 }}>
            <Box className="flex-1 items-center justify-end px-4 pb-8" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
              <TouchableWithoutFeedback>
                <Animated.View style={{ width: '100%', transform: [{ translateY: translateYAnim }] }}>
                  <Box
                    className="rounded-[28px] border border-amber-100/30 p-6"
                    style={{ backgroundColor: theme.background.secondary }}
                  >
                    <HStack className="items-start justify-between mb-4">
                      <HStack className="items-center flex-1 pr-3">
                        <Box
                          className="w-11 h-11 rounded-[14px] items-center justify-center mr-3"
                          style={{ backgroundColor: theme.background.primary }}
                        >
                          <MaterialIcons name="workspace-premium" size={22} color={theme.icon.primary} />
                        </Box>
                        <VStack className="flex-1">
                          <Text className="text-[20px] font-black tracking-tight" style={{ color: theme.text.primary }}>
                            {i18n.t('pro.upgradeTitle')}
                          </Text>
                          <Text className="text-[12px]" style={{ color: theme.text.secondary }}>
                            Premium Access
                          </Text>
                        </VStack>
                      </HStack>

                      <Pressable
                        onPress={closeWithAnimation}
                        className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
                        style={{ backgroundColor: theme.background.primary }}
                      >
                        <Ionicons name="close" size={18} color={theme.text.primary} />
                      </Pressable>
                    </HStack>

                    <Text className="text-[14px] leading-6 mb-4" style={{ color: theme.text.secondary }}>
                      {i18n.t('pro.upgradeMessage')}
                    </Text>

                    <VStack space="xs" className="mb-5">
                      {[i18n.t('pro.benefit1'), i18n.t('pro.benefit2'), i18n.t('pro.benefit3')].map((item, index) => (
                        <HStack key={index} className="items-center">
                          <Ionicons name="checkmark-circle" size={16} color={theme.status.success} />
                          <Text className="text-[13px] ml-2 flex-1" style={{ color: theme.text.secondary }}>
                            {item}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    <HStack className="gap-3">
                      <Pressable
                        onPress={closeWithAnimation}
                        className="flex-1 py-3.5 rounded-[14px] items-center justify-center active:opacity-80"
                        style={{ backgroundColor: theme.background.primary }}
                      >
                        <Text className="text-[14px] font-bold" style={{ color: theme.text.primary }}>
                          Later
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={handleUpgrade}
                        className="flex-1 py-3.5 rounded-[14px] items-center justify-center active:opacity-80"
                        style={{ backgroundColor: theme.button.primary.background }}
                      >
                        <Text className="text-[14px] font-black" style={{ color: theme.button.primary.text }}>
                          {i18n.t('pro.upgradeButton')}
                        </Text>
                      </Pressable>
                    </HStack>
                  </Box>
                </Animated.View>
              </TouchableWithoutFeedback>
            </Box>
          </BlurView>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};
