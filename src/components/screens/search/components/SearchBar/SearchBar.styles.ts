import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
  },
  searchIcon: {
    marginRight: SIZES.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    paddingVertical: SIZES.spacing.xs,
  },
  clearButton: {
    marginLeft: SIZES.spacing.sm,
    padding: SIZES.spacing.xs,
  },
});

