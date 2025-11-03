import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { MenuItem } from '@/constants/menuData';
import { getNavigationHandler } from '../../navigationHandlers';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export const QuickActions: React.FC = () => {
  const theme = useThemeColors();

  return (
    <ThemedCard variant='transparent' style={styles.quickActionsCard}>
      <ThemedButton
        title={i18n.t('gitaSummary.title')}
        onPress={() => {
          getNavigationHandler({ id: 'gita-summary' } as MenuItem)();
        }}
        variant="basic"
        size="md"
        fullWidth
        icon={<FontAwesome6 name="book-bookmark" size={SIZES.icon.lg} color={theme.button.primary.text} />}
      />
      <ThemedButton
        title={i18n.t('gitaMahatmya.title')}
        onPress={() => {
          getNavigationHandler({ id: 'gita-mahatmya' } as MenuItem)();
        }}
        variant="basic"
        size="md"
        fullWidth
        icon={<FontAwesome5 name="book" size={SIZES.icon.lg} color={theme.button.secondary.text} />}
      />
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  quickActionsCard: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginTop: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.sm,
  },
});
