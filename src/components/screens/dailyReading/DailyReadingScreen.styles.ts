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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    marginTop: SIZES.spacing.md,
  },
  motivationCard: {
    marginTop: SIZES.spacing.xl,
    alignItems: 'center',
  },
  motivationText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
});

