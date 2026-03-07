import AdsManager, { AdsManagerState } from '@/services/AdsManager';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Unified hook for showing ads from any screen.
 *
 * Usage:
 * ```tsx
 * const { showInterstitial, showRewarded, isInterstitialLoaded, isRewardedLoaded } = useAds();
 *
 * // Show interstitial on screen change
 * useEffect(() => {
 *   AdsManager.getInstance().recordScreenNavigation();
 *   showInterstitial();
 * }, []);
 *
 * // Show rewarded to unlock content
 * showRewarded(() => {
 *   setCommentaryUnlocked(true);
 * });
 * ```
 */
export const useAds = () => {
    const [state, setState] = useState<AdsManagerState>(() =>
        AdsManager.getInstance().getState()
    );
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        const unsubscribe = AdsManager.getInstance().subscribe((newState) => {
            if (mountedRef.current) {
                setState(newState);
            }
        });

        return () => {
            mountedRef.current = false;
            unsubscribe();
        };
    }, []);

    /**
     * Show an interstitial ad.
     * Automatically checks frequency cap (120s), screen count (every 3), and ad-free status.
     * @returns true if shown
     */
    const showInterstitial = useCallback(async (): Promise<boolean> => {
        return AdsManager.getInstance().showInterstitial();
    }, []);

    /**
     * Show a rewarded ad. Callback fires only when user earns the reward.
     *
     * @param onRewardEarned - Called after user watches the full ad
     * @returns true if shown
     *
     * @example
     * // Unlock commentary
     * showRewarded(() => setCommentaryUnlocked(true));
     *
     * // Remove ads for 30 minutes
     * showRewarded(() => activateAdFree(30));
     */
    const showRewarded = useCallback(
        async (onRewardEarned: () => void): Promise<boolean> => {
            return AdsManager.getInstance().showRewarded(onRewardEarned);
        },
        []
    );

    /**
     * Record a screen navigation for the interstitial frequency counter.
     * Call this in each screen's mount effect.
     */
    const recordNavigation = useCallback(() => {
        AdsManager.getInstance().recordScreenNavigation();
    }, []);

    return {
        /** Show an interstitial (respects freq cap) */
        showInterstitial,

        /** Show rewarded ad with callback */
        showRewarded,

        /** Record screen navigation for freq counter */
        recordNavigation,

        /** Whether an interstitial ad is ready */
        isInterstitialLoaded: state.interstitialState === 'loaded',

        /** Whether a rewarded ad is ready */
        isRewardedLoaded: state.rewardedState === 'loaded',

        /** Whether the app open ad is ready */
        isAppOpenLoaded: state.appOpenState === 'loaded',

        /** Whether the ads SDK has been initialized */
        isInitialized: state.initialized,
    };
};
