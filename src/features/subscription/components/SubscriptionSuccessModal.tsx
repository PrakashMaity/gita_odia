import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface SubscriptionSuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({ visible, onClose }) => {
    const theme = useThemeColors();
    const { width, height } = Dimensions.get('screen');

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
            <View className="flex-1 justify-center items-center">
                <TouchableWithoutFeedback>
                    <Animated.View style={{ position: 'absolute', width, height, opacity: fadeAnim }}>
                        <BlurView
                            intensity={80}
                            tint="dark"
                            style={{ flex: 1 }}
                        >
                            <View className="flex-1 bg-black/40" />
                        </BlurView>
                    </Animated.View>
                </TouchableWithoutFeedback>

                <Animated.View
                    style={{
                        width: width * 0.88,
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <View
                        className="rounded-[40px] overflow-hidden shadow-2xl"
                        style={{ backgroundColor: theme.background.primary }}
                    >
                        {/* Premium Gradient bar */}
                        <View className="h-2 w-full" style={{ backgroundColor: theme.icon.primary }} />

                        <VStack className="items-center px-8 py-12" space="xl">
                            {/* Success Icon with glowing effect */}
                            <View className="relative mb-4">
                                <Animated.View style={{ opacity: contentFadeAnim }}>
                                    <View
                                        className="w-24 h-24 rounded-full items-center justify-center border shadow-sm"
                                        style={{
                                            backgroundColor: theme.background.quaternary,
                                            borderColor: theme.border.primary + '50'
                                        }}
                                    >
                                        <MaterialIcons name="workspace-premium" size={56} color={theme.icon.primary} />
                                    </View>
                                </Animated.View>
                                <View className="absolute -top-4 -right-4">
                                    <FontAwesome5 name="sparkles" size={24} color="#fcd34d" />
                                </View>
                                <View className="absolute -bottom-2 -left-4">
                                    <FontAwesome5 name="heart" size={18} color="#fcd34d" />
                                </View>
                            </View>

                            <Animated.View style={{ opacity: contentFadeAnim, width: '100%' }}>
                                <VStack space="sm" className="items-center">
                                    <AppHeading variant="section" className="text-center font-bold" style={{ color: theme.text.primary }}>
                                        You're Pro!
                                    </AppHeading>
                                    <AppHeading variant="card" className="text-center" style={{ color: theme.text.secondary }}>
                                        {i18n.t('subscription.welcomePremium')}
                                    </AppHeading>
                                </VStack>

                                <AppText
                                    variant="body"
                                    className="text-center mt-6 leading-6"
                                    style={{ color: theme.text.disabled }}
                                >
                                    Thank you for supporting our mission to spread Gita's wisdom. All premium features are now unlocked for you.
                                </AppText>

                                <TouchableOpacity
                                    onPress={onClose}
                                    className="h-14 rounded-[24px] items-center justify-center mt-10 shadow-sm"
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: theme.background.tertiary || theme.border.primary, // Button background
                                        borderWidth: 1,
                                        borderColor: theme.border.primary + '30'
                                    }}
                                >
                                    <AppText variant="secondary" bold style={{ color: theme.background.primary || '#FFFFFF' }}>
                                        Start Exploring
                                    </AppText>
                                </TouchableOpacity>
                            </Animated.View>
                        </VStack>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

