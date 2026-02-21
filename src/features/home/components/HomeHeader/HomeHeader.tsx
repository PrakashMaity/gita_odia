import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useProStatus } from '@/hooks/useProStatus';
import i18n from '@/lib/i18n';
import { HomeImages } from '@/lib/utils/assets';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeHeader: React.FC = React.memo(() => {
  const { isPro } = useProStatus();
  const headerIcons = HomeImages.headerIcons;
  const fonts = getLanguageFonts();
  const insets = useSafeAreaInsets();

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  return (
    <HStack
      className="px-5 items-center justify-between z-10"
      style={{ paddingTop: Math.max(insets.top + 6, 18), paddingBottom: 14 }}
    >
      {/* ─── Left: Logo + Title + Crown ─── */}
      <HStack className="items-center flex-1">
        {/* Logo with premium golden glow ring */}
        <Box style={styles.logoOuter}>
          <LinearGradient
            colors={['#F59E0B', '#D97706', '#92400E', '#D97706', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradientRing}
          >
            <Box className="bg-white rounded-full p-[1.5px]">
              <Image
                source={HomeImages.logo}
                alt="App Logo"
                className="w-[44px] h-[44px] rounded-full"
              />
            </Box>
          </LinearGradient>
        </Box>

        {/* Decorative golden separator line */}
        <View style={styles.decorativeLine} />

        {/* Title with crown */}
        <View style={styles.titleContainer}>
          {/* ─── PRO Crown: Behind text, angled top-right ─── */}
          {isPro && (
            <View style={[styles.crownContainer, { zIndex: -1 }]}>
              <View style={styles.crownCircle}>
                <FontAwesome5 name="crown" size={10} color="#FFD700" />
              </View>
            </View>
          )}

          <Text
            className="text-[#3E2723]"
            style={{
              fontFamily: fonts.regional_secondary,
              fontWeight: Platform.OS === 'ios' ? '900' : 'bold',
              fontSize: 21,
              letterSpacing: -0.3,
              textShadowColor: 'rgba(255,255,255,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
              zIndex: 1,
            }}
          >
            {i18n.t('home.headerTitle')}
          </Text>
        </View>
      </HStack>

      {/* ─── Right: Notification Button ─── */}
      <Pressable
        onPress={handleNotificationPress}
        className="active:opacity-70"
        style={styles.notificationOuter}
      >
        <LinearGradient
          colors={['#3E2723', '#2C1810']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.notificationButton}
        >
          <Image
            source={headerIcons.notification}
            alt="Notifications"
            className="w-[18px] h-[18px]"
            resizeMode="contain"
            tintColor="#FFD700"
          />
        </LinearGradient>
      </Pressable>
    </HStack>
  );
});

const styles = StyleSheet.create({
  logoOuter: {
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 100,
  },
  logoGradientRing: {
    padding: 2.5,
    borderRadius: 100,
  },
  decorativeLine: {
    width: 1,
    height: 28,
    backgroundColor: '#D97706',
    opacity: 0.2,
    marginHorizontal: 12,
    borderRadius: 1,
  },
  titleContainer: {
    position: 'relative',
    flexShrink: 1,
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    right: -14,
    transform: [{ rotate: '20deg' }],
  },
  crownCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2C1810',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationOuter: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 100,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(78, 52, 46, 0.5)',
  },
});

HomeHeader.displayName = 'HomeHeader';
