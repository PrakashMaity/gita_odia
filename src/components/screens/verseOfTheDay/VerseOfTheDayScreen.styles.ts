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
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.xl,
  },
  dateBadge: {
    alignSelf: 'center',
    marginTop: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.radius.full,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  verseCard: {
    marginTop: SIZES.spacing.xl,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.md,
    paddingBottom: SIZES.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  speakerButton: {
    width: SIZES.icon.lg + SIZES.spacing.sm,
    height: SIZES.icon.lg + SIZES.spacing.sm,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: SIZES.borderSize.xs,
  },
  speakerButtonActive: {
    opacity: 0.8,
  },
  chapterInfo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  verseTextContainer: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.md,
  },
  verseText: {
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: '500',
  },
  translationContainer: {
    paddingTop: SIZES.spacing.md,
    borderTopWidth: 1,
  },
  translation: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginTop: SIZES.spacing.xl,
    gap: SIZES.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    gap: SIZES.spacing.sm,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inspirationCard: {
    marginTop: SIZES.spacing.xl,
  },
  inspirationText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  introCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.md,
  },
  introTitle: {
    flex: 1,
  },
  introText: {
    lineHeight: SIZES.spacing.xl,
  },
});

