import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  card: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
    gap: SIZES.spacing.md,
  },
  chapterIndicator: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.radius.sm,
  },
  chapterNumber: {
    color: '#FFFFFF',
  },
  chapterTitle: {
    flex: 1,
  },
});

