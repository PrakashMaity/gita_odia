import { getAdUnitIds } from '@/components/ads/config/config';
import { shouldShowAds } from '@/services/adFreeService';
import { AppState, AppStateStatus } from 'react-native';
import {
    AdEventType,
    AppOpenAd,
    InterstitialAd,
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

// ─── Types ───────────────────────────────────────────────────────────────────

type AdState = 'idle' | 'loading' | 'loaded' | 'showing' | 'error';

interface AdsManagerState {
    initialized: boolean;
    interstitialState: AdState;
    rewardedState: AdState;
    appOpenState: AdState;
}

type StateListener = (state: AdsManagerState) => void;

// ─── Constants ───────────────────────────────────────────────────────────────

/** Minimum seconds between interstitial ads */
const INTERSTITIAL_COOLDOWN_MS = 120_000; // 120 seconds

/** Number of screen navigations before showing interstitial */
const SCREEN_NAV_THRESHOLD = 3;

/** Minimum seconds between app open ads */
const APP_OPEN_COOLDOWN_MS = 30_000; // 30 seconds

/** Minimum background time before showing app open ad on resume */
const MIN_BACKGROUND_TIME_MS = 120_000; // 2 minutes

/** Delay before reloading an ad after close */
const RELOAD_DELAY_MS = 1_000;

/** Delay before retrying after error */
const ERROR_RETRY_DELAY_MS = 30_000;

/** Max retry attempts for ad loading */
const MAX_RETRY_ATTEMPTS = 3;

// ─── Logger ──────────────────────────────────────────────────────────────────

const TAG = '[AdsManager]';
const log = (...args: any[]) => console.log(TAG, ...args);
const warn = (...args: any[]) => console.warn(TAG, ...args);
const error = (...args: any[]) => console.error(TAG, ...args);

// ─── AdsManager Singleton ────────────────────────────────────────────────────

class AdsManager {
    private static instance: AdsManager | null = null;

    // Ad instances
    private interstitial: InterstitialAd | null = null;
    private rewarded: RewardedAd | null = null;
    private appOpen: AppOpenAd | null = null;

    // State
    private _state: AdsManagerState = {
        initialized: false,
        interstitialState: 'idle',
        rewardedState: 'idle',
        appOpenState: 'idle',
    };

    // Listeners
    private listeners: Set<StateListener> = new Set();

    // Cleanup functions
    private interstitialCleanup: (() => void) | null = null;
    private rewardedCleanup: (() => void) | null = null;
    private appOpenCleanup: (() => void) | null = null;
    private appStateSubscription: any = null;

    // Frequency capping
    private lastInterstitialTime = 0;
    private lastAppOpenTime = 0;
    private screenNavCount = 0;
    private backgroundTimestamp = 0;

    // Retry tracking
    private interstitialRetries = 0;
    private rewardedRetries = 0;
    private appOpenRetries = 0;

    // Rewarded callback
    private pendingRewardCallback: (() => void) | null = null;

    // ─── Singleton ───────────────────────────────────────────────────────────

    static getInstance(): AdsManager {
        if (!AdsManager.instance) {
            AdsManager.instance = new AdsManager();
        }
        return AdsManager.instance;
    }

    private constructor() { }

    // ─── State Management ────────────────────────────────────────────────────

    private get state(): AdsManagerState {
        return { ...this._state };
    }

    private updateState(partial: Partial<AdsManagerState>) {
        this._state = { ...this._state, ...partial };
        this.listeners.forEach((listener) => {
            try {
                listener(this.state);
            } catch (e) {
                error('Listener error:', e);
            }
        });
    }

    /** Subscribe to state changes. Returns unsubscribe function. */
    subscribe(listener: StateListener): () => void {
        this.listeners.add(listener);
        // Immediately emit current state
        listener(this.state);
        return () => {
            this.listeners.delete(listener);
        };
    }

    getState(): AdsManagerState {
        return this.state;
    }

    // ─── Initialization ──────────────────────────────────────────────────────

    /**
     * Initialize the ads manager. Call this once at app startup
     * (typically in your root layout or _layout.tsx).
     */
    async initialize(): Promise<void> {
        if (this._state.initialized) {
            log('Already initialized');
            return;
        }

        try {
            const { MobileAds, AdsConsent, AdsConsentStatus } = require('react-native-google-mobile-ads');

            // Request consent info update (GDPR / ATT)
            try {
                const consentInfo = await AdsConsent.requestInfoUpdate();
                if (
                    consentInfo.isConsentFormAvailable &&
                    consentInfo.status === AdsConsentStatus.REQUIRED
                ) {
                    await AdsConsent.showForm();
                }
            } catch (consentError) {
                warn('Consent flow error (non-fatal):', consentError);
            }

            // Configure test devices in development
            if (__DEV__) {
                await MobileAds().setRequestConfiguration({
                    testDeviceIdentifiers: ['EMULATOR'],
                });
                log('Test device configuration set');
            }

            // Initialize the SDK
            await MobileAds().initialize();
            log('Google Mobile Ads SDK initialized');

            this.updateState({ initialized: true });

            // Preload all ad types
            this.preloadAllAds();

            // Listen for app state changes (for app open ads)
            this.setupAppStateListener();
        } catch (e) {
            error('Initialization failed:', e);
            throw e;
        }
    }

    // ─── Preloading ──────────────────────────────────────────────────────────

    private preloadAllAds() {
        log('Preloading all ad types...');
        this.loadInterstitial();
        this.loadRewarded();
        this.loadAppOpen();
    }

    // ─── Ad Unit IDs ─────────────────────────────────────────────────────────

    private getInterstitialId(): string {
        if (__DEV__) return TestIds.INTERSTITIAL;
        return getAdUnitIds().interstitial;
    }

    private getRewardedId(): string {
        if (__DEV__) return TestIds.REWARDED;
        return getAdUnitIds().rewarded;
    }

    private getAppOpenId(): string | null {
        if (__DEV__) return TestIds.APP_OPEN;
        return getAdUnitIds().appOpen;
    }

    // ─── Interstitial ────────────────────────────────────────────────────────

    private loadInterstitial() {
        // Clean up previous instance
        this.interstitialCleanup?.();

        try {
            const adUnitId = this.getInterstitialId();
            this.interstitial = InterstitialAd.createForAdRequest(adUnitId, {
                keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
            });

            const unsubLoaded = this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
                log('Interstitial loaded');
                this.interstitialRetries = 0;
                this.updateState({ interstitialState: 'loaded' });
            });

            const unsubOpened = this.interstitial.addAdEventListener(AdEventType.OPENED, () => {
                log('Interstitial opened');
                this.updateState({ interstitialState: 'showing' });
            });

            const unsubClosed = this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
                log('Interstitial closed');
                this.lastInterstitialTime = Date.now();
                this.screenNavCount = 0;
                this.updateState({ interstitialState: 'idle' });
                // Auto-reload
                setTimeout(() => this.loadInterstitial(), RELOAD_DELAY_MS);
            });

            const unsubError = this.interstitial.addAdEventListener(
                AdEventType.ERROR,
                (err: any) => {
                    warn('Interstitial error:', err);
                    this.updateState({ interstitialState: 'error' });
                    // Retry with backoff
                    if (this.interstitialRetries < MAX_RETRY_ATTEMPTS) {
                        this.interstitialRetries++;
                        const delay = ERROR_RETRY_DELAY_MS * this.interstitialRetries;
                        log(`Retrying interstitial in ${delay / 1000}s (attempt ${this.interstitialRetries})`);
                        setTimeout(() => this.loadInterstitial(), delay);
                    }
                }
            );

            this.interstitialCleanup = () => {
                unsubLoaded();
                unsubOpened();
                unsubClosed();
                unsubError();
            };

            this.updateState({ interstitialState: 'loading' });
            this.interstitial.load();
        } catch (e) {
            error('Failed to create interstitial:', e);
        }
    }

    /**
     * Record a screen navigation. After `SCREEN_NAV_THRESHOLD` navigations,
     * the next call to `showInterstitial()` will be eligible.
     */
    recordScreenNavigation() {
        this.screenNavCount++;
    }

    /**
     * Show an interstitial ad.
     * Respects frequency cap (120s), screen count (every 3), and ad-free status.
     * @returns true if ad was shown, false otherwise
     */
    async showInterstitial(): Promise<boolean> {
        // Check ad-free / pro status
        const canShow = await shouldShowAds();
        if (!canShow) {
            log('Interstitial suppressed: ad-free active');
            return false;
        }

        // Check initialization
        if (!this._state.initialized) {
            warn('Cannot show interstitial: not initialized');
            return false;
        }

        // Check loaded
        if (this._state.interstitialState !== 'loaded' || !this.interstitial) {
            warn('Cannot show interstitial: not loaded');
            return false;
        }

        // Frequency cap: cooldown
        const now = Date.now();
        if (now - this.lastInterstitialTime < INTERSTITIAL_COOLDOWN_MS) {
            log('Interstitial suppressed: cooldown active');
            return false;
        }

        // Frequency cap: screen count
        if (this.screenNavCount < SCREEN_NAV_THRESHOLD) {
            log(
                `Interstitial suppressed: ${this.screenNavCount}/${SCREEN_NAV_THRESHOLD} screens`
            );
            return false;
        }

        try {
            this.interstitial.show();
            return true;
        } catch (e) {
            error('Error showing interstitial:', e);
            return false;
        }
    }

    // ─── Rewarded ─────────────────────────────────────────────────────────────

    private loadRewarded() {
        this.rewardedCleanup?.();

        try {
            const adUnitId = this.getRewardedId();
            this.rewarded = RewardedAd.createForAdRequest(adUnitId, {
                keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
            });

            const unsubLoaded = this.rewarded.addAdEventListener(
                RewardedAdEventType.LOADED,
                () => {
                    log('Rewarded loaded');
                    this.rewardedRetries = 0;
                    this.updateState({ rewardedState: 'loaded' });
                }
            );

            const unsubEarned = this.rewarded.addAdEventListener(
                RewardedAdEventType.EARNED_REWARD,
                (reward: any) => {
                    log('Reward earned:', reward);
                    // Execute the pending reward callback
                    if (this.pendingRewardCallback) {
                        try {
                            this.pendingRewardCallback();
                        } catch (e) {
                            error('Reward callback error:', e);
                        }
                        this.pendingRewardCallback = null;
                    }
                }
            );

            const unsubClosed = this.rewarded.addAdEventListener(AdEventType.CLOSED, () => {
                log('Rewarded closed');
                this.updateState({ rewardedState: 'idle' });
                // Auto-reload
                setTimeout(() => this.loadRewarded(), RELOAD_DELAY_MS);
            });

            const unsubError = this.rewarded.addAdEventListener(
                AdEventType.ERROR,
                (err: any) => {
                    warn('Rewarded error:', err);
                    this.pendingRewardCallback = null;
                    this.updateState({ rewardedState: 'error' });
                    if (this.rewardedRetries < MAX_RETRY_ATTEMPTS) {
                        this.rewardedRetries++;
                        const delay = ERROR_RETRY_DELAY_MS * this.rewardedRetries;
                        log(`Retrying rewarded in ${delay / 1000}s (attempt ${this.rewardedRetries})`);
                        setTimeout(() => this.loadRewarded(), delay);
                    }
                }
            );

            this.rewardedCleanup = () => {
                unsubLoaded();
                unsubEarned();
                unsubClosed();
                unsubError();
            };

            this.updateState({ rewardedState: 'loading' });
            this.rewarded.load();
        } catch (e) {
            error('Failed to create rewarded:', e);
        }
    }

    /**
     * Show a rewarded ad. The callback fires only if the user earns the reward.
     *
     * Use cases for Gita app:
     * - Watch ad → Unlock commentary
     * - Watch ad → Unlock Sanskrit meaning
     * - Watch ad → Remove ads for 30 minutes
     *
     * @param onRewardEarned - Called when user finishes watching and earns reward
     * @returns true if ad was shown, false otherwise
     */
    async showRewarded(onRewardEarned: () => void): Promise<boolean> {
        // Rewarded ads are always shown (even for ad-free users wanting extra content)
        // But still check initialization
        if (!this._state.initialized) {
            warn('Cannot show rewarded: not initialized');
            return false;
        }

        if (this._state.rewardedState !== 'loaded' || !this.rewarded) {
            warn('Cannot show rewarded: not loaded');
            return false;
        }

        try {
            this.pendingRewardCallback = onRewardEarned;
            this.rewarded.show();
            return true;
        } catch (e) {
            error('Error showing rewarded:', e);
            this.pendingRewardCallback = null;
            return false;
        }
    }

    // ─── App Open ─────────────────────────────────────────────────────────────

    private loadAppOpen() {
        this.appOpenCleanup?.();

        try {
            const adUnitId = this.getAppOpenId();
            if (!adUnitId) {
                log('App open ad unit ID not configured, skipping');
                return;
            }

            this.appOpen = AppOpenAd.createForAdRequest(adUnitId, {
                keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
            });

            const unsubLoaded = this.appOpen.addAdEventListener(AdEventType.LOADED, () => {
                log('App open loaded');
                this.appOpenRetries = 0;
                this.updateState({ appOpenState: 'loaded' });
            });

            const unsubOpened = this.appOpen.addAdEventListener(AdEventType.OPENED, () => {
                log('App open opened');
                this.updateState({ appOpenState: 'showing' });
            });

            const unsubClosed = this.appOpen.addAdEventListener(AdEventType.CLOSED, () => {
                log('App open closed');
                this.lastAppOpenTime = Date.now();
                this.updateState({ appOpenState: 'idle' });
                // Auto-reload
                setTimeout(() => this.loadAppOpen(), RELOAD_DELAY_MS);
            });

            const unsubError = this.appOpen.addAdEventListener(
                AdEventType.ERROR,
                (err: any) => {
                    warn('App open error:', err);
                    this.updateState({ appOpenState: 'error' });
                    if (this.appOpenRetries < MAX_RETRY_ATTEMPTS) {
                        this.appOpenRetries++;
                        const delay = ERROR_RETRY_DELAY_MS * this.appOpenRetries;
                        log(`Retrying app open in ${delay / 1000}s (attempt ${this.appOpenRetries})`);
                        setTimeout(() => this.loadAppOpen(), delay);
                    }
                }
            );

            this.appOpenCleanup = () => {
                unsubLoaded();
                unsubOpened();
                unsubClosed();
                unsubError();
            };

            this.updateState({ appOpenState: 'loading' });
            this.appOpen.load();
        } catch (e) {
            error('Failed to create app open:', e);
        }
    }

    /**
     * Show an app open ad.
     * Respects 30-second cooldown and ad-free status.
     * Called automatically on cold start and app resume (after 2+ min background).
     */
    async showAppOpen(): Promise<boolean> {
        const canShow = await shouldShowAds();
        if (!canShow) {
            log('App open suppressed: ad-free active');
            return false;
        }

        if (!this._state.initialized) {
            warn('Cannot show app open: not initialized');
            return false;
        }

        if (this._state.appOpenState !== 'loaded' || !this.appOpen) {
            warn('Cannot show app open: not loaded');
            return false;
        }

        // Cooldown check
        const now = Date.now();
        if (now - this.lastAppOpenTime < APP_OPEN_COOLDOWN_MS) {
            log('App open suppressed: cooldown active');
            return false;
        }

        try {
            this.appOpen.show();
            return true;
        } catch (e) {
            error('Error showing app open:', e);
            return false;
        }
    }

    // ─── App State Listener (for App Open Ads) ───────────────────────────────

    private setupAppStateListener() {
        this.appStateSubscription = AppState.addEventListener(
            'change',
            (nextAppState: AppStateStatus) => {
                if (nextAppState === 'background') {
                    this.backgroundTimestamp = Date.now();
                } else if (nextAppState === 'active') {
                    const timeInBackground = Date.now() - this.backgroundTimestamp;
                    if (
                        this.backgroundTimestamp > 0 &&
                        timeInBackground >= MIN_BACKGROUND_TIME_MS
                    ) {
                        log(
                            `App resumed after ${Math.round(timeInBackground / 1000)}s, showing app open ad`
                        );
                        this.showAppOpen();
                    }
                    this.backgroundTimestamp = 0;
                }
            }
        );
    }

    // ─── Cleanup ──────────────────────────────────────────────────────────────

    /** Tear down all ads and listeners. Call on app unmount. */
    destroy() {
        this.interstitialCleanup?.();
        this.rewardedCleanup?.();
        this.appOpenCleanup?.();
        this.appStateSubscription?.remove();
        this.listeners.clear();
        this.interstitial = null;
        this.rewarded = null;
        this.appOpen = null;
        this._state = {
            initialized: false,
            interstitialState: 'idle',
            rewardedState: 'idle',
            appOpenState: 'idle',
        };
        AdsManager.instance = null;
        log('Destroyed');
    }
}

export default AdsManager;
export type { AdsManagerState, AdState };
