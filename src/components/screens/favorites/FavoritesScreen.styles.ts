import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.lg,
  },
  chatContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  clearAllButton: {
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

