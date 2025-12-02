import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  headerWrapper: {
    width: '100%',
    marginBottom: SIZES.spacing.lg,
  },
  contentStack: {
    width: '100%',
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: 5,
    height: 32,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '600',
  },
  chaptersContainer: {
    width: '100%',
    gap: SIZES.spacing.md,
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: SIZES.spacing.lg,
    rowGap: SIZES.spacing.lg,
  },
  chapterItem: {
    width: '100%',
  },
  chapterItemGrid: {
    minWidth: 280,
  },
});

