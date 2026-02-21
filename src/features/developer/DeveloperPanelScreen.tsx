import {
  BannerAdComponent,
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
import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SettingsToggle } from '@/features/profile/components/settings';
import { useAdStatus } from '@/hooks/useAdStatus';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { LayoutImages } from '@/lib/utils/assets';
import { SIZES } from '@/rootconstants/sizes';
import { activateProMode, clearProMode } from '@/services/proService';
import { useSettingsStore } from '@/store/settingsStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';

const statusCardStyles = StyleSheet.create({
  card: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.md,
  },
  cardTitle: {
    marginBottom: SIZES.spacing.md,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  statusBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs / 2,
    borderRadius: SIZES.radius.sm,
  },
});

const StatusCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const theme = useThemeColors();
  return (
    <ThemedCard variant="card" style={statusCardStyles.card} borderVariant="primary" pattern="mandala" patternOpacity={0.05}>
      <ThemedLanguageText
        variant="primary"
        size="medium"
        fontFamily="regional_secondary"
        style={[statusCardStyles.cardTitle, { color: theme.text.primary }]}
      >
        {title}
      </ThemedLanguageText>
      {children}
    </ThemedCard>
  );
};

const StatusRow: React.FC<{
  label: string;
  value: boolean | string;
  isLast?: boolean;
}> = ({ label, value, isLast = false }) => {
  const theme = useThemeColors();
  const isBoolean = typeof value === 'boolean';
  const statusColor = isBoolean
    ? value
      ? theme.status.success
      : theme.status.error
    : theme.text.secondary;

  return (
    <View style={[statusCardStyles.statusRow, isLast && statusCardStyles.lastRow]}>
      <ThemedLanguageText
        variant="secondary"
        size="small"
        fontFamily="none"
        style={{ color: theme.text.secondary, flex: 1 }}
      >
        {label}
      </ThemedLanguageText>
      {isBoolean ? (
        <View
          style={[
            statusCardStyles.statusBadge,
            { backgroundColor: statusColor + '20' },
          ]}
        >
          <ThemedLanguageText
            variant="primary"
            size="small"
            fontFamily="none"
            style={{ color: statusColor, fontWeight: '600' }}
          >
            {value ? i18n.t('common.yes') : i18n.t('common.no')}
          </ThemedLanguageText>
        </View>
      ) : (
        <ThemedLanguageText
          variant="secondary"
          size="small"
          fontFamily="none"
          style={{ color: theme.text.secondary }}
        >
          {value}
        </ThemedLanguageText>
      )}
    </View>
  );
};

export const DeveloperPanelScreen: React.FC = () => {
  const theme = useThemeColors();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { settings, toggleDeveloperMode } = useSettingsStore();
  const adStatus = useAdStatus();
  const { refreshStatus } = useProStatus();
  const [loading, setLoading] = useState(false);

  // Ad instances for testing
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
    // Clear existing ads
    if (interstitialRef.current) {
      interstitialRef.current = null;
    }
    if (rewardedRef.current) {
      rewardedRef.current = null;
    }
    if (rewardedInterstitialRef.current) {
      rewardedInterstitialRef.current = null;
    }

    // Reset loaded states
    setInterstitialLoaded(false);
    setRewardedLoaded(false);
    setRewardedInterstitialLoaded(false);

    // Initialize ads for developer testing
    // Only initialize if SDK is initialized
    if (!adStatus.isInitialized) {
      console.warn('[Developer Panel] Ad SDK not initialized. Ads may not work.');
      return;
    }

    // Initialize Interstitial Ad
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
            if (interstitialRef.current) {
              interstitialRef.current.load();
            }
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

    // Initialize Rewarded Ad
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
            if (rewardedRef.current) {
              rewardedRef.current.load();
            }
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

    // Initialize Rewarded Interstitial Ad
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
            if (rewardedInterstitialRef.current) {
              rewardedInterstitialRef.current.load();
            }
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
    // Initialize ads when component mounts or when ad SDK becomes initialized
    if (adStatus.isInitialized) {
      initializeAds();
    }

    // Cleanup on unmount
    return () => {
      interstitialRef.current = null;
      rewardedRef.current = null;
      rewardedInterstitialRef.current = null;
    };
  }, [adStatus.isInitialized, initializeAds]);

  const handleTestInterstitialAd = async () => {
    try {
      if (interstitialRef.current && interstitialLoaded) {
        // Bypass all checks for developer testing
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
        // Bypass all checks for developer testing
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
        // Bypass all checks for developer testing
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
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        {AlertComponent}
        <ScreenHeader
          title="Developer Panel"
          subtitle="Monitor critical app features and status"
          containerStyle={{ backgroundColor: theme.background.secondary }}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
              label="Banner Ad"
              value={adStatus.bannerAdActive}
            />
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
            <ThemedLanguageText
              variant="secondary"
              size="small"
              fontFamily="none"
              style={[styles.infoText, { color: theme.text.secondary, marginBottom: SIZES.spacing.sm }]}
            >
              ℹ️ Test ads bypass all checks (developer mode, Pro, ad-free) for testing purposes
            </ThemedLanguageText>
            {!adStatus.isInitialized && (
              <ThemedLanguageText
                variant="secondary"
                size="small"
                fontFamily="none"
                style={[styles.warningText, { color: theme.status.error, marginBottom: SIZES.spacing.sm }]}
              >
                ⚠️ Ad SDK not initialized. Ads may not work. Please wait for SDK to initialize.
              </ThemedLanguageText>
            )}
            <ThemedLanguageText
              variant="secondary"
              size="small"
              fontFamily="none"
              style={[styles.sectionLabel, { color: theme.text.secondary, marginBottom: SIZES.spacing.sm }]}
            >
              Banner Ad (Live Display)
            </ThemedLanguageText>
            <View style={styles.bannerContainer}>
              <BannerAdComponent force={true} />
            </View>

            <ThemedButton
              title="Reload All Ads"
              onPress={initializeAds}
              variant="outline"
              disabled={loading || !adStatus.isInitialized}
              icon={<MaterialIcons name="refresh" size={SIZES.icon.sm} color={theme.icon.primary} />}
              style={styles.testButton}
              fullWidth
            />

            <ThemedButton
              title={interstitialLoaded ? "Test Interstitial Ad" : "Loading Interstitial..."}
              onPress={handleTestInterstitialAd}
              variant="primary"
              disabled={!interstitialLoaded || loading}
              icon={<MaterialIcons name="slideshow" size={SIZES.icon.sm} color={interstitialLoaded ? theme.text.primary : theme.text.secondary} />}
              style={styles.testButton}
              fullWidth
            />

            <ThemedButton
              title={rewardedLoaded ? "Test Rewarded Ad" : "Loading Rewarded..."}
              onPress={handleTestRewardedAd}
              variant="primary"
              disabled={!rewardedLoaded || loading}
              icon={<MaterialIcons name="monetization-on" size={SIZES.icon.sm} color={rewardedLoaded ? theme.text.primary : theme.text.secondary} />}
              style={styles.testButton}
              fullWidth
            />

            <ThemedButton
              title={rewardedInterstitialLoaded ? "Test Rewarded Interstitial Ad" : "Loading Rewarded Interstitial..."}
              onPress={handleTestRewardedInterstitialAd}
              variant="primary"
              disabled={!rewardedInterstitialLoaded || loading}
              icon={<MaterialIcons name="auto-awesome" size={SIZES.icon.sm} color={rewardedInterstitialLoaded ? theme.text.primary : theme.text.secondary} />}
              style={{ ...styles.testButton, marginBottom: 0 }}
              fullWidth
            />
          </StatusCard>

          {/* Pro Management */}
          <StatusCard title="Pro Management">
            <ThemedButton
              title="Activate Pro (30 days)"
              onPress={() => handleActivatePro(30)}
              variant="primary"
              disabled={loading}
              icon={<MaterialIcons name="workspace-premium" size={SIZES.icon.sm} color={theme.text.primary} />}
              style={styles.testButton}
              fullWidth
            />

            <ThemedButton
              title="Activate Pro (7 days)"
              onPress={() => handleActivatePro(7)}
              variant="primary"
              disabled={loading}
              icon={<MaterialIcons name="workspace-premium" size={SIZES.icon.sm} color={theme.text.primary} />}
              style={styles.testButton}
              fullWidth
            />

            <ThemedButton
              title="Activate Pro (1 day)"
              onPress={() => handleActivatePro(1)}
              variant="primary"
              disabled={loading}
              icon={<MaterialIcons name="workspace-premium" size={SIZES.icon.sm} color={theme.text.primary} />}
              style={styles.testButton}
              fullWidth
            />

            <ThemedButton
              title="Clear Pro Mode"
              onPress={handleClearProMode}
              variant="outline"
              disabled={loading}
              icon={<MaterialIcons name="delete" size={SIZES.icon.sm} color={theme.icon.primary} />}
              style={{ ...styles.testButton, marginBottom: 0 }}
              fullWidth
            />
          </StatusCard>

          {/* Developer Controls */}
          <ThemedCard variant="card" style={styles.controlsCard} borderVariant="primary" pattern="mandala" patternOpacity={0.05}>
            <ThemedLanguageText
              variant="primary"
              size="medium"
              fontFamily="regional_secondary"
              style={[statusCardStyles.cardTitle, { color: theme.text.primary }]}
            >
              Developer Controls
            </ThemedLanguageText>

            <SettingsToggle
              title={i18n.t('profile.developerMode')}
              subtitle={i18n.t('profile.developerModeDesc')}
              value={settings.developerMode}
              onValueChange={toggleDeveloperMode}
              icon={
                <MaterialIcons
                  name="code"
                  size={SIZES.icon.md}
                  color={theme.icon.primary}
                />
              }
            />
            <View style={{ height: SIZES.spacing.sm }} />
            <ThemedLanguageText
              variant="secondary"
              size="small"
              fontFamily="none"
              style={[styles.infoText, { color: theme.text.secondary }]}
            >
              ℹ️ "Ads Enabled" status is automatically calculated based on developer mode, Pro status, and ad-free status
            </ThemedLanguageText>
          </ThemedCard>

          <ThemedView style={styles.bottomSpacing} />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.spacing.lg,
  },
  controlsCard: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.md,
  },
  buttonRow: {
    marginBottom: SIZES.spacing.sm,
  },
  testButton: {
    marginBottom: SIZES.spacing.sm,
  },
  sectionLabel: {
    fontWeight: '500',
  },
  infoText: {
    fontWeight: '500',
    textAlign: 'center',
    padding: SIZES.spacing.xs,
    borderRadius: SIZES.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
    fontStyle: 'italic',
  },
  warningText: {
    fontWeight: '600',
    textAlign: 'center',
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.sm,
    backgroundColor: 'rgba(255,0,0,0.1)',
  },
  bannerContainer: {
    marginBottom: SIZES.spacing.md,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
    width: '100%',
  },
  bottomSpacing: {
    height: SIZES.spacing.xl,
  },
});
