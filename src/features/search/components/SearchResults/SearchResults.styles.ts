import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  resultsHeader: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.sm,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: SIZES.spacing.lg,
  },
  resultCardContainer: {
    marginBottom: SIZES.spacing.md,
  },
  resultCard: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chapterNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing.md,
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  verseInfo: {
    flex: 1,
  },
  verseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing.xs,
  },
  speaker: {
    fontSize: 12,
  },
  matchTypeBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
  },
  matchTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultContent: {
    marginBottom: SIZES.spacing.md,
  },
  verseText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SIZES.spacing.sm,
  },
  translationText: {
    fontSize: 13,
    lineHeight: 18,
  },
  resultFooter: {
    alignItems: 'flex-end',
  },
});

