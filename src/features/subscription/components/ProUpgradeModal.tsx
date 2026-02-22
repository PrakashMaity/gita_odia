import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';

interface ProUpgradeModalProps {
    visible: boolean;
    onClose: () => void;
    featureName?: string;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ visible, onClose, featureName }) => {
    const { width, height } = Dimensions.get('screen');
    const router = useRouter();
    const fonts = getLanguageFonts();

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
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, scaleAnim, fadeAnim]);

    const handleClose = () => {
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
        setTimeout(() => {
            router.push('/subscription');
        }, 200);
    };

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
                <TouchableWithoutFeedback onPress={handleClose}>
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
                        <Box className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                            <Box className="h-1.5 w-full bg-amber-500" />

                            <Pressable
                                onPress={handleClose}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-100 items-center justify-center z-10"
                            >
                                <Ionicons name="close" size={20} color="#666" />
                            </Pressable>

                            <VStack className="items-center px-6 py-10 gap-6">
                                <Box className="w-20 h-20 rounded-full bg-amber-50 items-center justify-center border border-amber-100">
                                    <MaterialIcons name="workspace-premium" size={42} color="#f59e0b" />
                                </Box>

                                <VStack className="gap-2">
                                    <Text
                                        className="text-neutral-900 text-2xl font-black text-center"
                                        style={{ fontFamily: fonts.regional_secondary }}
                                    >
                                        Upgrade to Pro
                                    </Text>
                                    <Text
                                        className="text-neutral-500 text-base text-center leading-6"
                                        style={{ fontFamily: fonts.regional_secondary }}
                                    >
                                        {featureName
                                            ? `${featureName} is a premium feature. Upgrade to Pro to unlock it and all other premium content.`
                                            : 'Unlock all premium features, ad-free experience and support our mission by upgrading to Pro.'}
                                    </Text>
                                </VStack>

                                <VStack className="w-full gap-3 mt-2">
                                    <Pressable
                                        onPress={handleUpgrade}
                                        className="bg-amber-500 h-14 rounded-2xl items-center justify-center shadow-lg active:bg-amber-600"
                                    >
                                        <Text className="text-white font-bold text-lg">View Pro Plans</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={handleClose}
                                        className="h-12 items-center justify-center active:opacity-60"
                                    >
                                        <Text className="text-neutral-500 font-semibold">Maybe Later</Text>
                                    </Pressable>
                                </VStack>
                            </VStack>
                        </Box>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </Modal>
    );
};
