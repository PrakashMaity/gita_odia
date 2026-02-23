import {
  createInterstitialAd,
  createRewardedAd,
  createRewardedInterstitialAd,
  setupInterstitialListeners,
  setupRewardedInterstitialListeners,
  setupRewardedListeners,
  showInterstitialAd,
  showRewardedAd,
  showRewardedInterstitialAd,
} from '@/components/ads';
import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SettingsToggle } from '@/features/profile/components/settings';
import { useAdStatus } from '@/hooks/useAdStatus';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useProStatus } from '@/hooks/useProStatus';
import i18n from '@/lib/i18n';
import { LayoutImages } from '@/lib/utils/assets';
import { activateProMode, clearProMode } from '@/services/proService';
import { useSettingsStore } from '@/store/settingsStore';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';

const StatusCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Box className="mb-4 p-4 rounded-xl bg-neutral-900 border border-white/20">
      <Text className="mb-4 text-white font-semibold text-lg font-regional_secondary">
        {title}
      </Text>
      {children}
    </Box>
  );
};

const StatusRow: React.FC<{
  label: string;
  value: boolean | string;
  isLast?: boolean;
}> = ({ label, value, isLast = false }) => {
  const isBoolean = typeof value === 'boolean';

  return (
    <View className={`flex-row justify-between items-center py-2 ${!isLast ? 'border-b border-white/10' : ''}`}>
      <Text className="text-neutral-400 text-sm flex-1 font-regional_secondary">
        {label}
      </Text>
      {isBoolean ? (
        <View
          className={`px-2 py-1 flex-row items-center justify-center rounded-md ${value ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
        >
          <Text className={`text-xs font-semibold ${value ? 'text-green-500' : 'text-red-500'} font-regional_secondary`}>
            {value ? i18n.t('common.yes') : i18n.t('common.no')}
          </Text>
        </View>
      ) : (
        <Text className="text-neutral-400 text-sm font-regional_secondary">
          {value}
        </Text>
      )}
    </View>
  );
};

export const DeveloperPanelScreen: React.FC = () => {
  const { showAlert, AlertComponent } = useCustomAlert();
  const { settings, toggleDeveloperMode } = useSettingsStore();
  const adStatus = useAdStatus();
  const { refreshStatus } = useProStatus();
  const [loading, setLoading] = useState(false);

  const interstitialRef = useRef<any>(null);
  const rewardedRef = useRef<any>(null);
  const rewardedInterstitialRef = useRef<any>(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [rewardedInterstitialLoaded, setRewardedInterstitialLoaded] = useState(false);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const initializeAds = React.useCallback(() => {
    if (interstitialRef.current) interstitialRef.current = null;
    if (rewardedRef.current) rewardedRef.current = null;
    if (rewardedInterstitialRef.current) rewardedInterstitialRef.current = null;

    setInterstitialLoaded(false);
    setRewardedLoaded(false);
    setRewardedInterstitialLoaded(false);

    if (!adStatus.isInitialized) {
      console.warn('[Developer Panel] Ad SDK not initialized. Ads may not work.');
      return;
    }

    try {
      const interstitial = createInterstitialAd();
      interstitialRef.current = interstitial;
      setupInterstitialListeners(interstitial, {
        onLoaded: () => {
          console.log('[Developer Panel] Interstitial ad loaded');
          setInterstitialLoaded(true);
        },
        onClosed: () => {
          setInterstitialLoaded(false);
          setTimeout(() => {
            if (interstitialRef.current) interstitialRef.current.load();
          }, 1000);
        },
        onError: (error) => {
          console.error('[Developer Panel] Interstitial ad error:', error);
          setInterstitialLoaded(false);
        },
      });
      interstitial.load();
    } catch (error) {
      console.error('[Developer Panel] Error initializing interstitial ad:', error);
      setInterstitialLoaded(false);
    }

    try {
      const rewarded = createRewardedAd();
      rewardedRef.current = rewarded;
      setupRewardedListeners(rewarded, {
        onLoaded: () => {
          console.log('[Developer Panel] Rewarded ad loaded');
          setRewardedLoaded(true);
        },
        onClosed: () => {
          setRewardedLoaded(false);
          setTimeout(() => {
            if (rewardedRef.current) rewardedRef.current.load();
          }, 1000);
        },
        onError: (error) => {
          console.error('[Developer Panel] Rewarded ad error:', error);
          setRewardedLoaded(false);
        },
      });
      rewarded.load();
    } catch (error) {
      console.error('[Developer Panel] Error initializing rewarded ad:', error);
      setRewardedLoaded(false);
    }

    try {
      const rewardedInterstitial = createRewardedInterstitialAd();
      rewardedInterstitialRef.current = rewardedInterstitial;
      setupRewardedInterstitialListeners(rewardedInterstitial, {
        onLoaded: () => {
          console.log('[Developer Panel] Rewarded interstitial ad loaded');
          setRewardedInterstitialLoaded(true);
        },
        onClosed: () => {
          setRewardedInterstitialLoaded(false);
          setTimeout(() => {
            if (rewardedInterstitialRef.current) rewardedInterstitialRef.current.load();
          }, 1000);
        },
        onError: (error) => {
          console.error('[Developer Panel] Rewarded interstitial ad error:', error);
          setRewardedInterstitialLoaded(false);
        },
      });
      rewardedInterstitial.load();
    } catch (error) {
      console.error('[Developer Panel] Error initializing rewarded interstitial ad:', error);
      setRewardedInterstitialLoaded(false);
    }
  }, [adStatus.isInitialized]);

  useEffect(() => {
    if (adStatus.isInitialized) {
      initializeAds();
    }
    return () => {
      interstitialRef.current = null;
      rewardedRef.current = null;
      rewardedInterstitialRef.current = null;
    };
  }, [adStatus.isInitialized, initializeAds]);

  const handleTestInterstitialAd = async () => {
    try {
      if (interstitialRef.current && interstitialLoaded) {
        await showInterstitialAd(interstitialRef.current, true);
        setInterstitialLoaded(false);
      } else {
        showAlert(
          createErrorAlert(
            'Ad Not Ready',
            'Interstitial ad is not loaded yet. Please wait a moment and try again.'
          )
        );
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      showAlert(
        createErrorAlert(
          'Error',
          'Failed to show interstitial ad. Please try again.'
        )
      );
    }
  };

  const handleTestRewardedAd = async () => {
    try {
      if (rewardedRef.current && rewardedLoaded) {
        await showRewardedAd(rewardedRef.current, true);
        setRewardedLoaded(false);
      } else {
        showAlert(
          createErrorAlert(
            'Ad Not Ready',
            'Rewarded ad is not loaded yet. Please wait a moment and try again.'
          )
        );
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      showAlert(
        createErrorAlert(
          'Error',
          'Failed to show rewarded ad. Please try again.'
        )
      );
    }
  };

  const handleTestRewardedInterstitialAd = async () => {
    try {
      if (rewardedInterstitialRef.current && rewardedInterstitialLoaded) {
        await showRewardedInterstitialAd(rewardedInterstitialRef.current, true);
        setRewardedInterstitialLoaded(false);
      } else {
        showAlert(
          createErrorAlert(
            'Ad Not Ready',
            'Rewarded interstitial ad is not loaded yet. Please wait a moment and try again.'
          )
        );
      }
    } catch (error) {
      console.error('Error showing rewarded interstitial ad:', error);
      showAlert(
        createErrorAlert(
          'Error',
          'Failed to show rewarded interstitial ad. Please try again.'
        )
      );
    }
  };

  const handleActivatePro = async (days: number = 30) => {
    setLoading(true);
    try {
      const result = await activateProMode(days);
      if (result.success) {
        showAlert(
          createSuccessAlert(
            i18n.t('common.success', { defaultValue: 'Success' }),
            result.message
          )
        );
        await refreshStatus();
      } else {
        showAlert(
          createErrorAlert(
            i18n.t('common.error', { defaultValue: 'Error' }),
            result.message
          )
        );
      }
    } catch (error) {
      console.error('Error activating Pro mode:', error);
      showAlert(
        createErrorAlert(
          i18n.t('common.error', { defaultValue: 'Error' }),
          'Failed to activate Pro mode. Please try again.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearProMode = async () => {
    setLoading(true);
    try {
      const result = await clearProMode();
      if (result.success) {
        showAlert(
          createSuccessAlert(
            i18n.t('common.success', { defaultValue: 'Success' }),
            result.message
          )
        );
        await refreshStatus();
      } else {
        showAlert(
          createErrorAlert(
            i18n.t('common.error', { defaultValue: 'Error' }),
            result.message
          )
        );
      }
    } catch (error) {
      console.error('Error clearing Pro mode:', error);
      showAlert(
        createErrorAlert(
          i18n.t('common.error', { defaultValue: 'Error' }),
          'Failed to clear Pro mode. Please try again.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={LayoutImages.background1}
      className="flex-1 bg-black"
      resizeMode="cover"
      blurRadius={1.5}
    >
      <View className="flex-1 bg-black/60">
        {AlertComponent}
        <ScreenHeader
          title="Developer Panel"
          subtitle="Monitor critical app features and status"
          containerClassName="bg-black/90 pb-4 border-b border-white/10"
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        >
          {/* App Status */}
          <StatusCard title="App Status">
            <StatusRow
              label="Developer Mode"
              value={settings.developerMode}
            />
            <StatusRow
              label="Ads Initialized"
              value={adStatus.isInitialized}
            />
            <StatusRow
              label="Ads Enabled"
              value={adStatus.isEnabled}
            />
            <StatusRow
              label="Ad-Free Active"
              value={adStatus.adFreeActive}
              isLast
            />
          </StatusCard>

          {/* Ad Status */}
          <StatusCard title="Ad Active Status">
            <StatusRow
              label="Interstitial Ad"
              value={interstitialLoaded}
            />
            <StatusRow
              label="Rewarded Ad"
              value={rewardedLoaded}
            />
            <StatusRow
              label="Rewarded Interstitial Ad"
              value={rewardedInterstitialLoaded}
              isLast
            />
          </StatusCard>

          {/* Ad Testing */}
          <StatusCard title="Test Ads">
            <Text className="text-center italic text-neutral-400 text-xs p-2 bg-white/5 rounded-md mb-3">
              ℹ️ Test ads bypass all checks (developer mode, Pro, ad-free) for testing purposes
            </Text>

            {!adStatus.isInitialized && (
              <Text className="text-center font-bold text-red-400 text-xs p-3 bg-red-500/10 rounded-md mb-3">
                ⚠️ Ad SDK not initialized. Ads may not work. Please wait for SDK to initialize.
              </Text>
            )}

            <Text className="font-semibold text-neutral-400 text-sm mb-3">
              Full-Screen Ad Testing
            </Text>

            <View className="gap-2">
              <Button
                variant="outline"
                onPress={initializeAds}
                disabled={loading || !adStatus.isInitialized}
                className="w-full border-neutral-600 rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="refresh" size={16} color="white" className="mr-2" />} />
                <ButtonText className="text-white text-sm">Reload All Ads</ButtonText>
              </Button>

              <Button
                onPress={handleTestInterstitialAd}
                disabled={!interstitialLoaded || loading}
                className="w-full bg-white rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="slideshow" size={16} color={interstitialLoaded ? "black" : "#6b7280"} className="mr-2" />} />
                <ButtonText className={interstitialLoaded ? "text-black text-sm" : "text-gray-500 text-sm"}>
                  {interstitialLoaded ? "Test Interstitial Ad" : "Loading Interstitial..."}
                </ButtonText>
              </Button>

              <Button
                onPress={handleTestRewardedAd}
                disabled={!rewardedLoaded || loading}
                className="w-full bg-white rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="monetization-on" size={16} color={rewardedLoaded ? "black" : "#6b7280"} className="mr-2" />} />
                <ButtonText className={rewardedLoaded ? "text-black text-sm" : "text-gray-500 text-sm"}>
                  {rewardedLoaded ? "Test Rewarded Ad" : "Loading Rewarded..."}
                </ButtonText>
              </Button>

              <Button
                onPress={handleTestRewardedInterstitialAd}
                disabled={!rewardedInterstitialLoaded || loading}
                className="w-full bg-white rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="auto-awesome" size={16} color={rewardedInterstitialLoaded ? "black" : "#6b7280"} className="mr-2" />} />
                <ButtonText className={rewardedInterstitialLoaded ? "text-black text-sm" : "text-gray-500 text-sm"}>
                  {rewardedInterstitialLoaded ? "Test Rewarded Interstitial Ad" : "Loading Rewarded Interstitial..."}
                </ButtonText>
              </Button>
            </View>
          </StatusCard>

          {/* Pro Management */}
          <StatusCard title="Pro Management">
            <View className="gap-2">
              <Button
                onPress={() => handleActivatePro(30)}
                disabled={loading}
                className="w-full bg-white rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="workspace-premium" size={16} color="black" className="mr-2" />} />
                <ButtonText className="text-black text-sm">Activate Pro (30 days)</ButtonText>
              </Button>

              <Button
                onPress={() => handleActivatePro(7)}
                disabled={loading}
                className="w-full bg-white rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="workspace-premium" size={16} color="black" className="mr-2" />} />
                <ButtonText className="text-black text-sm">Activate Pro (7 days)</ButtonText>
              </Button>

              <Button
                onPress={() => handleActivatePro(1)}
                disabled={loading}
                className="w-full bg-white rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="workspace-premium" size={16} color="black" className="mr-2" />} />
                <ButtonText className="text-black text-sm">Activate Pro (1 day)</ButtonText>
              </Button>

              <Button
                variant="outline"
                onPress={handleClearProMode}
                disabled={loading}
                className="w-full border-neutral-600 rounded-xl"
              >
                <ButtonIcon as={() => <MaterialIcons name="delete" size={16} color="white" className="mr-2" />} />
                <ButtonText className="text-white text-sm">Clear Pro Mode</ButtonText>
              </Button>
            </View>
          </StatusCard>

          {/* Developer Controls */}
          <Box className="mb-4 p-4 rounded-xl bg-neutral-900 border border-white/20">
            <Text className="mb-4 text-white font-semibold text-lg font-regional_secondary">
              Developer Controls
            </Text>

            <SettingsToggle
              title={i18n.t('profile.developerMode')}
              subtitle={i18n.t('profile.developerModeDesc')}
              value={settings.developerMode}
              onValueChange={toggleDeveloperMode}
              icon={
                <MaterialIcons
                  name="code"
                  size={24}
                  color="white"
                />
              }
            />

            <View className="mt-4">
              <Text className="text-center italic text-neutral-400 text-xs p-2 bg-white/5 rounded-md">
                ℹ️ "Ads Enabled" status is automatically calculated based on developer mode, Pro status, and ad-free status
              </Text>
            </View>
          </Box>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
