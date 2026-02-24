import { useSemanticColors } from '@/hooks/useSemanticColors';
import { Box } from '@/components/ui/box';
import { Grid, GridItem } from '@/components/ui/grid';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { MenuItem } from '@/constants/menuData';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { getNavigationHandler } from '../../navigationHandlers';

export const QuickActions: React.FC = React.memo(() => {
  const { colors } = useSemanticColors();
  const fonts = getLanguageFonts();
  const theme = useThemeColors();

  return (
    <Grid
      className="px-4 gap-4 pb-2"
      _extra={{ className: 'grid-cols-2' }}
    >
      <GridItem _extra={{ className: 'col-span-1' }}>
        <Pressable
          onPress={() => getNavigationHandler({ id: 'gita-summary' } as MenuItem)()}
          className="active:opacity-80"
        >
          <Box className="flex-row items-center justify-start rounded-[20px] border border-primary-100 shadow-sm p-3 h-[72px] overflow-hidden relative" style={{ backgroundColor: theme.background.secondary }}>
            <Box className="absolute -right-3 -top-3 opacity-[0.04]" pointerEvents="none">
              <FontAwesome6 name="book-bookmark" size={70} color="#000" />
            </Box>
            <Box className="w-11 h-11 bg-primary-50 rounded-[16px] items-center justify-center mr-3 shrink-0">
              <FontAwesome6 name="book-bookmark" size={18} color={colors.primary600} />
            </Box>
            <Text
              className="text-neutral-800 font-extrabold text-[14px] flex-1 tracking-tight"
              style={{ fontFamily: fonts.regional_secondary }}
              numberOfLines={2}
            >
              {i18n.t('gitaSummary.title')}
            </Text>
          </Box>
        </Pressable>
      </GridItem>

      <GridItem _extra={{ className: 'col-span-1' }}>
        <Pressable
          onPress={() => getNavigationHandler({ id: 'gita-mahatmya' } as MenuItem)()}
          className="active:opacity-80"
        >
          <Box className="flex-row items-center justify-start rounded-[20px] border border-primary-100 shadow-sm p-3 h-[72px] overflow-hidden relative" style={{ backgroundColor: theme.background.secondary }}>
            <Box className="absolute -right-3 -top-3 opacity-[0.04]" pointerEvents="none">
              <FontAwesome5 name="book" size={70} color="#000" />
            </Box>
            <Box className="w-11 h-11 bg-primary-50 rounded-[16px] items-center justify-center mr-3 shrink-0">
              <FontAwesome5 name="book" size={18} color={colors.primary600} />
            </Box>
            <Text
              className="text-neutral-800 font-extrabold text-[14px] flex-1 tracking-tight"
              style={{ fontFamily: fonts.regional_secondary }}
              numberOfLines={2}
            >
              {i18n.t('gitaMahatmya.title')}
            </Text>
          </Box>
        </Pressable>
      </GridItem>
    </Grid>
  );
});

QuickActions.displayName = 'QuickActions';
