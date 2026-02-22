import { isProActive } from '@/services/proService';
import { getSubscriptionDetails, isPremium } from '@/services/revenuecat';
import { SubscriptionDetailsDisplay } from '@/types/subscription';
import { create } from 'zustand';

interface ProState {
    isPro: boolean;
    isLoading: boolean;
    subscriptionDetails: SubscriptionDetailsDisplay | null;
    refreshProStatus: () => Promise<void>;
}

export const useProStore = create<ProState>((set) => ({
    isPro: false,
    isLoading: true,
    subscriptionDetails: null,
    refreshProStatus: async () => {
        try {
            set({ isLoading: true });

            // Check both local Pro status and RevenueCat premium status
            const [hasFreePro, hasPaidPremium, details] = await Promise.all([
                isProActive(),
                isPremium(),
                getSubscriptionDetails(),
            ]);

            set({
                isPro: hasFreePro || hasPaidPremium,
                subscriptionDetails: details,
                isLoading: false
            });
        } catch (error) {
            console.error('[proStore] Error refreshing Pro status:', error);
            set({ isPro: false, subscriptionDetails: null, isLoading: false });
        }
    },
}));
