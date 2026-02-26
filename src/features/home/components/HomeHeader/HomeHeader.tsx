import { AppText } from '@/components/ui/AppText';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { useProStatus } from '@/hooks/useProStatus';
import i18n from '@/lib/i18n';
import { HomeImages } from '@/lib/utils/assets';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_COLORS = {
  primary400: '#FBBF24',
  primary500: '#F59E0B',
  primary600: '#D97706',
  primary800: '#92400E',
  secondary800: '#3E2723',
  secondary900: '#2C1810',
};

export const HomeHeader: React.FC = React.memo(() => {
  const { isPro } = useProStatus();
  const headerIcons = HomeImages.headerIcons;
  const fonts = getLanguageFonts();
  const insets = useSafeAreaInsets();

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const colors = HEADER_COLORS;
  const styles = getStyles(colors);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPro) {
      Animated.loop(
        Animated.sequence([
          Animated.delay(3000), // idle for 3 seconds
          // Quick bounce and shake
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scaleAnim, { toValue: 1.25, duration: 150, useNativeDriver: true }),
              Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(rotateAnim, { toValue: -1, duration: 75, useNativeDriver: true }),
              Animated.timing(rotateAnim, { toValue: 1, duration: 75, useNativeDriver: true }),
              Animated.timing(rotateAnim, { toValue: -1, duration: 75, useNativeDriver: true }),
              Animated.timing(rotateAnim, { toValue: 0, duration: 75, useNativeDriver: true }),
            ])
          ])
        ])
      ).start();
    }
  }, [isPro, scaleAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-2deg', '18deg', '38deg']
  });

  return (
    <Box className="px-3 w-full z-20" style={{ paddingTop: Math.max(insets.top + 8, 20), paddingBottom: 12 }}>
      <BlurView
        intensity={60}
        tint="light"
        style={styles.blurContainer}
      >
        <HStack className="items-center justify-between px-2 py-2 w-full">
          {/* ─── Left: Logo + Title + Crown ─── */}
          <HStack className="items-center flex-1">
            {/* Logo with premium golden glow ring */}
            <Box style={styles.logoOuter}>
              <LinearGradient
                colors={[colors.primary500, colors.primary600, colors.primary800, colors.primary600, colors.primary500]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradientRing}
              >
                <Box className="bg-white rounded-full p-[1.5px]">
                  <Image
                    source={HomeImages.logo}
                    alt="App Logo"
                    className="w-[42px] h-[42px] rounded-full"
                  />
                </Box>
              </LinearGradient>
            </Box>

            <View style={styles.titleContainer}>
              <AppText
                className="text-neutral-800 pr-2.5 z-10"
                font="regional-secondary"
                variant="card-title"
                style={{
                  letterSpacing: -0.3,
                  textShadowColor: 'rgba(255,255,255,0.7)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 4,
                }}
                numberOfLines={1}
              >
                {i18n.t('home.headerTitle')}
              </AppText>

              {/* ─── PRO Crown: Absolute top right ─── */}
              {isPro && (
                <Animated.View style={[styles.crownBadge, { transform: [{ scale: scaleAnim }, { rotate: spin }] }]}>
                  <FontAwesome5 name="crown" size={9} color={colors.primary800} />
                </Animated.View>
              )}
            </View>
          </HStack>

          {/* ─── Right: Notification Button ─── */}
          <Pressable
            onPress={handleNotificationPress}
            className="active:opacity-70"
            style={styles.notificationOuter}
          >
            <LinearGradient
              colors={[colors.primary500, colors.primary600, colors.primary800]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.notificationButton}
            >
              <Image
                source={headerIcons.notification}
                alt="Notifications"
                className="w-[18px] h-[18px]"
                resizeMode="contain"
                tintColor="#FFFFFF"
              />
            </LinearGradient>
          </Pressable>
        </HStack>
      </BlurView>
    </Box>
  );
});

const getStyles = (colors: any) => StyleSheet.create({
  blurContainer: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  logoOuter: {
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 100,
  },
  logoGradientRing: {
    padding: 2,
    borderRadius: 100,
  },
  titleContainer: {
    marginLeft: 12,
    position: 'relative',
    justifyContent: 'center',
    flexShrink: 1,
  },
  crownBadge: {
    position: 'absolute',
    top: -12,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary400,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  notificationOuter: {
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 100,
    marginLeft: 8,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});

HomeHeader.displayName = 'HomeHeader';
