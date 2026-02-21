import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxxl,
  },
  statsSection: {
    marginTop: SIZES.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.md,
  },
  motivationCard: {
    marginTop: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  motivationIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: SIZES.spacing.md,
  },
  motivationTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  motivationText: {
    textAlign: 'left',
    lineHeight: 24,
    fontSize: 15,
  },
});
