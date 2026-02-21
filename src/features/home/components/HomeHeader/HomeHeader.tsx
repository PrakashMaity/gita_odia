import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useProStatus } from '@/hooks/useProStatus';
import i18n from '@/lib/i18n';
import { HomeImages } from '@/lib/utils/assets';
import { getLanguageFonts } from '@/types/font.interface';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
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
      style={{ paddingTop: Math.max(insets.top + 4, 16), paddingBottom: 12 }}
    >
      {/* ─── Left: Logo + Title + PRO ─── */}
      <HStack className="items-center gap-3 flex-1">
        {/* Logo with premium white ring + shadow */}
        <Box style={styles.logoShadow}>
          <Box className="p-[2.5px] rounded-full bg-white/90">
            <Image
              source={HomeImages.logo}
              alt="App Logo"
              className="w-[46px] h-[46px] rounded-full"
            />
          </Box>
        </Box>

        {/* Title + Badge */}
        <HStack className="items-center gap-2 flex-1">
          <Text
            className="text-[#3E2723] text-[22px]"
            style={{
              fontFamily: fonts.regional_secondary,
              fontWeight: Platform.OS === 'ios' ? '900' : 'bold',
              textShadowColor: 'rgba(255,255,255,0.4)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {i18n.t('home.headerTitle')}
          </Text>

          {/* ─── PRO Badge: Tiny luxury micro-tag ─── */}
          {isPro && (
            <LinearGradient
              colors={['#3E2723', '#2C1810']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proBadge}
            >
              <Text style={styles.proText}>PRO</Text>
            </LinearGradient>
          )}
        </HStack>
      </HStack>

      {/* ─── Right: Notification Button ─── */}
      <Pressable
        onPress={handleNotificationPress}
        className="active:opacity-70"
        style={styles.notificationShadow}
      >
        <Box className="w-10 h-10 rounded-full bg-[#2C1810] items-center justify-center border border-[#4E342E]/60">
          <Image
            source={headerIcons.notification}
            alt="Notifications"
            className="w-[18px] h-[18px]"
            resizeMode="contain"
            tintColor="#FFD700"
          />
        </Box>
      </Pressable>
    </HStack>
  );
});

const styles = StyleSheet.create({
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderRadius: 100,
  },
  proBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginTop: 2,
  },
  proText: {
    color: '#D4A017',
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  notificationShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

HomeHeader.displayName = 'HomeHeader';
