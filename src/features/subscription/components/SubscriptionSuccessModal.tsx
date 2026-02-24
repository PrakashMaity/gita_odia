import { useSemanticColors } from '@/hooks/useSemanticColors';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';

interface SubscriptionSuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({ visible, onClose }) => {
  const { colors } = useSemanticColors();
    const { width, height } = Dimensions.get('screen');
    const fonts = getLanguageFonts();

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const contentFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 40,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(contentFadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0);
            fadeAnim.setValue(0);
            contentFadeAnim.setValue(0);
        }
    }, [visible, scaleAnim, fadeAnim, contentFadeAnim]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
        >
            <Box className="flex-1 justify-center items-center">
                <TouchableWithoutFeedback>
                    <BlurView
                        intensity={100}
                        tint="dark"
                        style={{ position: 'absolute', width, height }}
                    >
                        <Box className="absolute bg-black/40" style={{ width, height }} />
                    </BlurView>
                </TouchableWithoutFeedback>

                <Animated.View
                    style={{
                        width: width * 0.88,
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <Box className="bg-white rounded-[40px] overflow-hidden shadow-2xl">
                        {/* Premium Gradient bar */}
                        <Box className="h-2 w-full bg-primary-500" />

                        <VStack className="items-center px-8 py-12" space="xl">
                            {/* Success Icon with glowing effect */}
                            <Box className="relative mb-4">
                                <Animated.View style={{ opacity: contentFadeAnim }}>
                                    <Box className="w-24 h-24 rounded-full bg-primary-50 items-center justify-center border border-primary-100 shadow-sm">
                                        <MaterialIcons name="workspace-premium" size={56} color={colors.primary600} />
                                    </Box>
                                </Animated.View>
                                <Box className="absolute -top-4 -right-4">
                                    <FontAwesome5 name="sparkles" size={24} color="#fcd34d" />
                                </Box>
                                <Box className="absolute -bottom-2 -left-4">
                                    <FontAwesome5 name="heart" size={18} color="#fcd34d" />
                                </Box>
                            </Box>

                            <Animated.View style={{ opacity: contentFadeAnim, width: '100%' }}>
                                <VStack space="sm" className="items-center">
                                    <Text
                                        className="text-neutral-900 text-3xl font-black text-center tracking-tight"
                                        style={{ fontFamily: fonts.regional_secondary }}
                                    >
                                        You're Pro!
                                    </Text>
                                    <Text
                                        className="text-neutral-500 text-lg text-center font-medium"
                                        style={{ fontFamily: fonts.regional_secondary }}
                                    >
                                        স্বাগতম প্রিমিয়াম সদস্যপদে
                                    </Text>
                                </VStack>

                                <Text
                                    className="text-neutral-400 text-center mt-6 leading-6 text-[15px]"
                                    style={{ fontFamily: fonts.regional_secondary }}
                                >
                                    Thank you for supporting our mission to spread Gita's wisdom. All premium features are now unlocked for you.
                                </Text>

                                <Pressable
                                    onPress={onClose}
                                    className="bg-black h-16 rounded-[24px] items-center justify-center mt-10 active:opacity-80 shadow-lg"
                                >
                                    <Text className="text-white font-black text-lg tracking-tight">
                                        Start Exploring
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        </VStack>
                    </Box>
                </Animated.View>
            </Box>
        </Modal>
    );
};
