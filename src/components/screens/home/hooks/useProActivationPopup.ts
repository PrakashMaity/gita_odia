import { hasProPopupBeenShown, isProActive, markProPopupShown } from '@/services/proService';
import { useSettingsStore } from '@/store';
import { useEffect, useState } from 'react';

/**
 * Custom hook to handle Pro activation popup
 * Shows popup 3 seconds after onboarding completion if:
 * - User just completed onboarding
 * - Pro is active
 * - Popup hasn't been shown yet
 */
export const useProActivationPopup = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { settings } = useSettingsStore();

  useEffect(() => {
    const checkAndShowPopup = async () => {
      try {
        // Check if onboarding is completed
        if (!settings.onboardingCompleted) {
          return;
        }

        // Check if popup has already been shown
        const hasBeenShown = await hasProPopupBeenShown();
        if (hasBeenShown) {
          return;
        }

        // Check if Pro is active
        const proActive = await isProActive();
        if (!proActive) {
          return;
        }

        // Show popup after 3 seconds
        const timer = setTimeout(async () => {
          setIsPopupVisible(true);
          await markProPopupShown();
        }, 3000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error checking Pro activation popup:', error);
      }
    };

    checkAndShowPopup();
  }, [settings.onboardingCompleted]);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return {
    isPopupVisible,
    handleClosePopup,
  };
};
