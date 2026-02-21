import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxxl,
    alignItems: 'center',
  },
  presetsContainer: {
    width: '100%',
    marginTop: SIZES.spacing.xl,
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SIZES.spacing.md,
    textAlign: 'center',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.spacing.sm,
    justifyContent: 'center',
  },
  presetButton: {
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    minWidth: 80,
  },
  presetButtonActive: {
    // Active state handled by theme
  },
  presetText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  presetTextActive: {
    fontWeight: '600',
  },
  completionCard: {
    marginTop: SIZES.spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  completionIcon: {
    fontSize: 48,
    marginBottom: SIZES.spacing.sm,
  },
  completionText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
});

