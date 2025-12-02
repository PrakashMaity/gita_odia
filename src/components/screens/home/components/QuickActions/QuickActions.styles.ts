import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  quickActionsCard: {
    width: '100%',
    gap: SIZES.spacing.md,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  quickActionsCardMobile: {
    marginHorizontal: SIZES.spacing.lg,
    flexDirection: 'row',
  },
  quickActionsCardTablet: {
    marginHorizontal: 0,
    flexDirection: 'row',
    gap: SIZES.spacing.lg,
  },
  quickActionsCardStacked: {
    flexDirection: 'column',
  },
  actionBackground: {
    flex: 1,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  actionBackgroundTablet: {
    minHeight: 140,
  },
  actionBackgroundImage: {
    borderRadius: SIZES.radius.lg,
  },
  actionButton: {
    backgroundColor: 'transparent',
  },
  actionText: {
    textTransform: 'uppercase',
  },
});

