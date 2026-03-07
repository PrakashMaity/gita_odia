import { useAds } from '@/hooks/useAds';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AdGateProps {
    /** Content shown when locked (before watching ad) */
    lockedContent?: React.ReactNode;

    /** Content shown after ad reward is earned */
    unlockedContent: React.ReactNode;

    /** Callback when content is unlocked */
    onUnlock?: () => void;

    /** Custom button text */
    buttonText?: string;

    /** Custom button icon (emoji or component) */
    buttonIcon?: string;

    /** Start unlocked (e.g., if previously unlocked) */
    defaultUnlocked?: boolean;
}

/**
 * Gatekeeper component for rewarded ad content.
 *
 * Usage:
 * ```tsx
 * <AdGate
 *   lockedContent={<Text>Commentary preview...</Text>}
 *   unlockedContent={<FullCommentary />}
 *   onUnlock={() => saveUnlockedState()}
 *   buttonText="Watch ad to unlock commentary"
 * />
 * ```
 */
export const AdGate: React.FC<AdGateProps> = ({
    lockedContent,
    unlockedContent,
    onUnlock,
    buttonText = 'Watch ad to unlock',
    buttonIcon = '🎬',
    defaultUnlocked = false,
}) => {
    const [isUnlocked, setIsUnlocked] = useState(defaultUnlocked);
    const [isLoading, setIsLoading] = useState(false);
    const { showRewarded, isRewardedLoaded } = useAds();

    const handleWatchAd = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const shown = await showRewarded(() => {
            setIsUnlocked(true);
            onUnlock?.();
        });

        if (!shown) {
            // Ad wasn't available — unlock anyway as fallback
            setIsUnlocked(true);
            onUnlock?.();
        }
        setIsLoading(false);
    };

    if (isUnlocked) {
        return <>{unlockedContent}</>;
    }

    return (
        <View style={styles.container}>
            {lockedContent && <View style={styles.lockedContent}>{lockedContent}</View>}

            <TouchableOpacity
                style={[
                    styles.button,
                    !isRewardedLoaded && styles.buttonDisabled,
                ]}
                onPress={handleWatchAd}
                disabled={isLoading}
                activeOpacity={0.7}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <>
                        <Text style={styles.buttonIcon}>{buttonIcon}</Text>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </>
                )}
            </TouchableOpacity>

            {!isRewardedLoaded && !isLoading && (
                <Text style={styles.hint}>Ad loading, please wait...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    lockedContent: {
        width: '100%',
        opacity: 0.5,
        marginBottom: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF8F00',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#FF8F00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#9E9E9E',
        shadowColor: '#9E9E9E',
    },
    buttonIcon: {
        fontSize: 18,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    hint: {
        marginTop: 8,
        fontSize: 12,
        color: '#9E9E9E',
        fontStyle: 'italic',
    },
});

export default AdGate;
