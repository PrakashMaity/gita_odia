import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';

// Define the shape of promotional content
interface PromotionContent {
  id: string;
  title: string;
  subtitle: string;
  features: string[];
  ctaText: string;
  ctaAction: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  theme: 'primary' | 'secondary' | 'accent';
  endDate?: Date;
}

const PROMO_SHOWN_KEY = '@promo_shown_status';
const PROMO_LAST_SHOWN_KEY = '@promo_last_shown_date';
const PROMO_COOLDOWN_DAYS = 3;

interface PromotionalModalProps {
  isVisible: boolean;
  onClose: () => void;
  mockContent?: PromotionContent; // For testing/forcing specific content
}

export const PromotionalModal: React.FC<PromotionalModalProps> = ({
  isVisible,
  onClose,
  mockContent,
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<PromotionContent | null>(null);

  // Default promotional content (e.g., Premium Subscription)
  const defaultPromo: PromotionContent = {
    id: 'premium_launch_v1',
    title: 'Unlock Premium Features',
    subtitle: 'Enhance your spiritual journey with exclusive features and ad-free experience.',
    features: [
      'Ad-free reading experience',
      'Advanced search & filtering',
      'Unlimited bookmarks & notes',
      'Offline access to all translations',
      'Priority support',
    ],
    ctaText: 'View Premium Plans',
    ctaAction: () => {
      onClose();
      router.push('/subscription');
    },
    icon: 'star',
    theme: 'primary',
  };

  useEffect(() => {
    checkPromoEligibility();
  }, [isVisible]);

  const checkPromoEligibility = async () => {
    if (!isVisible) return;

    try {
      // If mock content provided, always show
      if (mockContent) {
        setCurrentPromo(mockContent);
        setShouldShow(true);
        return;
      }

      const activePromo = defaultPromo;

      // Check if we have an active promo
      if (!activePromo) {
        setShouldShow(false);
        return;
      }

      // Check if promo has expired
      if (activePromo.endDate && new Date() > activePromo.endDate) {
        setShouldShow(false);
        return;
      }

      const statusMapString = await AsyncStorage.getItem(PROMO_SHOWN_KEY);
      const lastShownString = await AsyncStorage.getItem(PROMO_LAST_SHOWN_KEY);

      const statusMap = statusMapString ? JSON.parse(statusMapString) : {};

      // If user has permanently dismissed this specific promo
      if (statusMap[activePromo.id] === 'dismissed') {
        setShouldShow(false);
        return;
      }

      // Check cooldown period
      if (lastShownString) {
        const lastShown = new Date(lastShownString);
        const daysSinceLastShown = (new Date().getTime() - lastShown.getTime()) / (1000 * 3600 * 24);

        if (daysSinceLastShown < PROMO_COOLDOWN_DAYS) {
          setShouldShow(false);
          return;
        }
      }

      // If we passed all checks, show the promo
      setCurrentPromo(activePromo);
      setShouldShow(true);

      // Record show time
      await AsyncStorage.setItem(PROMO_LAST_SHOWN_KEY, new Date().toISOString());

    } catch (error) {
      console.error('Error checking promo eligibility:', error);
      setShouldShow(false);
    }
  };

  const handleDismiss = async (permanently: boolean = false) => {
    try {
      if (permanently && currentPromo) {
        const statusMapString = await AsyncStorage.getItem(PROMO_SHOWN_KEY);
        const statusMap = statusMapString ? JSON.parse(statusMapString) : {};

        statusMap[currentPromo.id] = 'dismissed';
        await AsyncStorage.setItem(PROMO_SHOWN_KEY, JSON.stringify(statusMap));
      }
    } catch (error) {
      console.error('Error recording promo dismissal:', error);
    } finally {
      onClose();
    }
  };

  if (!shouldShow || !currentPromo) return null;

  return (
    <Modal
      visible={isVisible && shouldShow}
      transparent
      animationType="fade"
      onRequestClose={() => handleDismiss(false)}
    >
      <Box className="flex-1 justify-center items-center bg-primary-950/60 p-4">
        {/* Backdrop overlay to close on tap outside */}
        <TouchableOpacity
          className="absolute inset-0 w-full h-full"
          activeOpacity={1}
          onPress={() => handleDismiss(false)}
        />

        <Box className="w-full max-w-md bg-white rounded-[32px] overflow-hidden border border-primary-200 shadow-xl m-4 z-10">
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-6"
          >
            {/* Header / Graphic Area */}
            <Box className="pt-10 pb-6 px-6 items-center border-b border-primary-200/50 relative">
              <Box className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center mb-6 border border-primary-200">
                <Ionicons
                  name={currentPromo.icon}
                  size={32}
                  color="#0ea5e9"
                />
              </Box>

              <Text className="text-2xl font-bold text-center text-primary-950 mb-2 font-regional_secondary">
                {currentPromo.title}
              </Text>

              <Text className="text-sm text-center text-primary-600 font-regional_secondary leading-5">
                {currentPromo.subtitle}
              </Text>
            </Box>

            {/* Features List */}
            <Box className="px-6 py-6 border-b border-primary-200/50">
              {currentPromo.features.map((feature, index) => (
                <Box key={index} className="flex-row items-center mb-4">
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#10b981"
                    style={{ marginRight: 16 }}
                  />
                  <Text className="flex-1 text-base text-primary-800 font-regional_secondary">
                    {feature}
                  </Text>
                </Box>
              ))}
            </Box>

            {/* Footer / Actions */}
            <Box className="px-6 pt-6 gap-3">
              <Button
                size="xl"
                className="w-full bg-primary-950 rounded-2xl"
                onPress={currentPromo.ctaAction}
              >
                <ButtonText className="text-white font-bold text-base font-regional_secondary">
                  {currentPromo.ctaText}
                </ButtonText>
              </Button>

              <Button
                variant="link"
                className="w-full"
                onPress={() => handleDismiss(true)}
              >
                <ButtonText className="text-primary-600 text-sm font-regional_secondary">
                  No thanks, maybe later
                </ButtonText>
              </Button>
            </Box>
          </ScrollView>

          {/* Close Button (Top Right) */}
          <TouchableOpacity
            className="absolute top-4 right-4 w-10 h-10 items-center justify-center rounded-full bg-primary-950/10"
            onPress={() => handleDismiss(false)}
          >
            <Ionicons name="close" size={24} color="#0f172a" />
          </TouchableOpacity>
        </Box>
      </Box>
    </Modal>
  );
};
