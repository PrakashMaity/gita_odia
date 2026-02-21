import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MenuItem, getMenuSections } from '@/constants/menuData';
import { useThemeColors } from '@/hooks/useTheme';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image as RNImage } from 'react-native';

interface MenuGridProps {
  onMenuItemPress?: (item: MenuItem) => void;
}

const MenuItemIcon: React.FC<{ item: MenuItem; color?: string; size?: number }> = React.memo(({ item, color = '#d97706', size = 24 }) => {
  if (item.image) {
    return (
      <RNImage
        source={item.image as any}
        style={{ width: size, height: size, opacity: color === '#000' ? 0.05 : 1 }}
        resizeMode="contain"
      />
    );
  }

  if (!item.iconName || !item.iconFamily) return null;

  const iconProps = { name: item.iconName as any, size, color };

  switch (item.iconFamily) {
    case 'FontAwesome5': return <FontAwesome5 {...iconProps} />;
    case 'FontAwesome6': return <FontAwesome6 {...iconProps} />;
    case 'MaterialIcons': return <MaterialIcons {...iconProps} />;
    case 'Ionicons': return <Ionicons {...iconProps} />;
    default: return <MaterialIcons {...iconProps} />;
  }
});
MenuItemIcon.displayName = 'MenuItemIcon';

// --- Layout Card Variants (Light Theme) --- //

const FeaturedCard: React.FC<{ item: MenuItem; onPress: any; fonts: any; theme: any }> = ({ item, onPress, fonts, theme }) => (
  <Pressable onPress={() => onPress(item)} className="w-full mb-4 active:opacity-80">
    <Box className="w-full rounded-[28px] p-5 border border-amber-100/50 shadow-sm overflow-hidden relative" style={{ backgroundColor: theme.background.secondary }}>
      <Box className="absolute -right-6 -top-6 opacity-[0.05]" pointerEvents="none">
        <MenuItemIcon item={item} color="#000" size={140} />
      </Box>
      <HStack className="items-center justify-between">
        <VStack className="flex-1 pr-4">
          <Box className="w-11 h-11 bg-amber-50 rounded-[18px] items-center justify-center mb-3">
            <Box className="w-6 h-6 items-center justify-center">
              <MenuItemIcon item={item} color="#d97706" size={22} />
            </Box>
          </Box>
          <Text className="text-neutral-800 font-black text-[22px] mb-1 tracking-tight" style={{ fontFamily: fonts.regional_secondary }}>
            {item.title}
          </Text>
          {item.description && (
            <Text className="text-neutral-500 text-[13px] leading-5" style={{ fontFamily: fonts.regional_secondary }} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  </Pressable>
);

const MediumHorizontalCard: React.FC<{ item: MenuItem; onPress: any; fonts: any; theme: any }> = ({ item, onPress, fonts, theme }) => (
  <Pressable className="flex-1 active:opacity-80" onPress={() => onPress(item)}>
    <Box className="rounded-[24px] p-4 border border-amber-100/50 shadow-sm items-start h-[130px] overflow-hidden relative" style={{ backgroundColor: theme.background.primary }}>
      <Box className="absolute -right-5 -bottom-5 opacity-[0.05]" pointerEvents="none">
        <MenuItemIcon item={item} color="#000" size={110} />
      </Box>
      <Box className="w-12 h-12 bg-orange-50/80 rounded-[18px] items-center justify-center mb-3">
        <Box className="w-7 h-7 overflow-hidden rounded-lg items-center justify-center">
          <MenuItemIcon item={item} color="#d97706" size={26} />
        </Box>
      </Box>
      <Text className="text-neutral-800 font-extrabold text-[15px] mb-0.5 w-full tracking-tight" style={{ fontFamily: fonts.regional_secondary }} numberOfLines={1}>
        {item.title}
      </Text>
      <Text className="text-neutral-500 text-[11px] w-full" style={{ fontFamily: fonts.regional_secondary }} numberOfLines={1}>
        {item.description || item.title}
      </Text>
    </Box>
  </Pressable>
);

const TallCard: React.FC<{ item: MenuItem; onPress: any; fonts: any; theme: any }> = ({ item, onPress, fonts, theme }) => (
  <Pressable className="flex-1 active:opacity-80" onPress={() => onPress(item)}>
    <Box className="rounded-[26px] p-5 border border-amber-100/50 shadow-sm h-[200px] justify-between relative overflow-hidden" style={{ backgroundColor: theme.background.primary }}>
      <Box className="absolute -bottom-5 -right-5 opacity-[0.05]" pointerEvents="none">
        <MenuItemIcon item={item} color="#000" size={120} />
      </Box>
      <Box className="w-14 h-14 bg-rose-50 rounded-[20px] items-center justify-center">
        <Box className="w-8 h-8 items-center justify-center overflow-hidden rounded-lg">
          <MenuItemIcon item={item} color="#e11d48" size={30} />
        </Box>
      </Box>
      <VStack>
        <Text className="text-neutral-800 font-black text-[18px] mb-1 tracking-tight" style={{ fontFamily: fonts.regional_secondary }} numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-neutral-500 text-[12px] leading-4" style={{ fontFamily: fonts.regional_secondary }} numberOfLines={2}>
          {item.description}
        </Text>
      </VStack>
    </Box>
  </Pressable>
);

const StackedSmallCard: React.FC<{ item: MenuItem; onPress: any; fonts: any; theme: any; colorContext: 'rose' | 'orange' | 'amber' }> = ({ item, onPress, fonts, theme, colorContext }) => {
  const bgColors = {
    rose: 'bg-rose-50',
    orange: 'bg-orange-50',
    amber: 'bg-amber-50'
  };
  const iconColors = {
    rose: '#e11d48',
    orange: '#ea580c',
    amber: '#d97706'
  };

  return (
    <Pressable onPress={() => onPress(item)} className="active:opacity-80 flex-1">
      <Box className="rounded-[20px] p-3.5 border border-amber-100/50 shadow-sm flex-row items-center h-[92px] relative overflow-hidden" style={{ backgroundColor: theme.background.primary }}>
        <Box className="absolute -right-4 -top-4 opacity-[0.05]" pointerEvents="none">
          <MenuItemIcon item={item} color="#000" size={80} />
        </Box>
        <Box className={`w-12 h-12 ${bgColors[colorContext]} rounded-[18px] items-center justify-center mr-3 shrink-0`}>
          <Box className="w-6 h-6 items-center justify-center overflow-hidden rounded-lg">
            <MenuItemIcon item={item} color={iconColors[colorContext]} size={20} />
          </Box>
        </Box>
        <VStack className="flex-1 justify-center">
          <Text className="text-neutral-800 font-extrabold text-[15px] mb-0.5 tracking-tight" style={{ fontFamily: fonts.regional_secondary }} numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-neutral-500 text-[11px]" style={{ fontFamily: fonts.regional_secondary }} numberOfLines={1}>
            {item.description || item.title}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
};

// --- Main MenuGrid --- //

export const MenuGrid: React.FC<MenuGridProps> = React.memo(({ onMenuItemPress }) => {
  const menuSections = getMenuSections();
  const fonts = getLanguageFonts();
  const theme = useThemeColors();

  const handleItemPress = (item: MenuItem) => {
    if (onMenuItemPress) {
      onMenuItemPress(item);
    } else if (item.action) {
      item.action();
    }
  };

  const prayers = menuSections.find(s => s.id === 'prayers')?.items || [];
  const chapters = menuSections.find(s => s.id === 'chapters')?.items || [];

  return (
    <VStack className="w-full pb-6 px-4">
      {/* PRAYERS SECTION - ASYMMETRIC GRID */}
      {prayers.length > 0 && (
        <VStack className="mb-8">
          {/* Row 1: Large Featured */}
          {prayers[0] && <FeaturedCard item={prayers[0]} onPress={handleItemPress} fonts={fonts} theme={theme} />}

          {/* Row 2: Two Medium side by side */}
          <HStack className="w-full gap-4 mb-4">
            {prayers[1] && <MediumHorizontalCard item={prayers[1]} onPress={handleItemPress} fonts={fonts} theme={theme} />}
            {prayers[2] && <MediumHorizontalCard item={prayers[2]} onPress={handleItemPress} fonts={fonts} theme={theme} />}
          </HStack>

          {/* Row 3: Tall Left, Stacked Right */}
          <HStack className="w-full gap-4">
            {prayers[3] && <TallCard item={prayers[3]} onPress={handleItemPress} fonts={fonts} theme={theme} />}
            <VStack className="flex-1 justify-between gap-4">
              {prayers[4] ? (
                <StackedSmallCard item={prayers[4]} onPress={handleItemPress} fonts={fonts} theme={theme} colorContext="rose" />
              ) : (
                <Box className="flex-1" />
              )}
              {/* Optional 6th item if it exists, otherwise a stylistic placeholder or just balanced spacing component */}
              {prayers[5] ? (
                <StackedSmallCard item={prayers[5]} onPress={handleItemPress} fonts={fonts} theme={theme} colorContext="orange" />
              ) : (
                <Box className="rounded-[20px] border border-amber-100/50 flex-1 h-[92px] items-center justify-center overflow-hidden" style={{ backgroundColor: theme.background.quaternary }}>
                  <Ionicons name="sparkles" size={24} color="#fcd34d" opacity={0.5} />
                </Box>
              )}
            </VStack>
          </HStack>
        </VStack>
      )}

      {/* CLEAR SEPARATION BEFORE CHAPTERS */}
      {chapters.length > 0 && (
        <VStack>
          <HStack className="items-center mb-5 mt-2">
            <Text
              className="text-neutral-900 text-[22px] font-black tracking-tighter"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              অধ্যায়
            </Text>
            <Box className="h-[1px] flex-1 bg-amber-900/10 ml-4" />
          </HStack>

          {/* CHAPTER SECTION: Balanced Medium Cards or Wrapped */}
          <HStack className="flex-wrap gap-4">
            {chapters.map(item => (
              <Box key={item.id} style={{ width: '47.5%' }}>
                <MediumHorizontalCard item={item} onPress={handleItemPress} fonts={fonts} theme={theme} />
              </Box>
            ))}
          </HStack>
        </VStack>
      )}
    </VStack>
  );
});
MenuGrid.displayName = 'MenuGrid';
