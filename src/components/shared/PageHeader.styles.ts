import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.sm,
  },
  backButton: {
    marginRight: SIZES.spacing.lg,
    marginTop: SIZES.spacing.xs,
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  headerContent: {
    flex: 1,
    padding: SIZES.spacing.md,
  },
  title: {
    marginBottom: SIZES.spacing.xs,
    lineHeight: 32,
  },
  subtitle: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 24,
    opacity: 0.85,
  },
});

