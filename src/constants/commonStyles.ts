import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

/**
 * Common screen styles used across multiple screen components
 */
export const commonScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  scrollContentNoPadding: {
    paddingBottom: SIZES.spacing.xl,
  },
});

/**
 * Common card styles used across multiple components
 */
export const commonCardStyles = StyleSheet.create({
  introCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  card: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  contentCard: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.xl,
  },
  verseCard: {
    marginBottom: SIZES.spacing.xl,
    padding: SIZES.spacing.xl,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chapterCard: {
    alignItems: 'center',
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.15,
    shadowRadius: SIZES.shadow.lg,
    elevation: 4,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
});

/**
 * Common section styles used across multiple components
 */
export const commonSectionStyles = StyleSheet.create({
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  sectionHeaderWithPadding: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xxxl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.md,
  },
  sectionIndicatorSmall: {
    width: 5,
    height: 32,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
  },
  sectionTitleBold: {
    flex: 1,
    fontWeight: '600',
  },
});

/**
 * Common text styles used across multiple components
 */
export const commonTextStyles = StyleSheet.create({
  introText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
  introTitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.md,
  },
  centeredText: {
    textAlign: 'center',
  },
  centeredTextWithMargin: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  secondaryText: {
    lineHeight: SIZES.spacing.xl,
  },
  secondaryTextSmall: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 20,
    opacity: 0.85,
  },
  subtitle: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 24,
  },
  verseText: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.lg,
    lineHeight: 36,
    alignItems: 'center',
    alignSelf: 'center',
  },
  translationText: {
    textAlign: 'center',
    lineHeight: 28,
    marginTop: SIZES.spacing.sm,
  },
  progressText: {
    opacity: 0.9,
    fontWeight: '600',
    textAlign: 'center',
  },
});

/**
 * Common list item styles used across multiple components
 */
export const commonListItemStyles = StyleSheet.create({
  list: {
    gap: SIZES.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: SIZES.radius.round,
    marginTop: SIZES.spacing.sm,
  },
  itemText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacing.xs,
  },
});

/**
 * Common layout styles used across multiple components
 */
export const commonLayoutStyles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.2,
    shadowRadius: SIZES.shadow.md,
    elevation: 3,
  },
  iconContainerSmall: {
    width: SIZES.avatar.sm,
    height: SIZES.avatar.sm,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.sm,
  },
  actionButton: {
    borderWidth: SIZES.borderSize.sm,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
  },
  chapterContainer: {
    paddingHorizontal: SIZES.spacing.lg,
  },
});

/**
 * Header and navigation styles
 */
export const commonHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.md,
  },
  headerContent: {
    flex: 1,
    padding: SIZES.spacing.md,
  },
  headerTitle: {
    marginBottom: SIZES.spacing.xs,
    lineHeight: 32,
  },
  headerSubtitle: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 24,
    opacity: 0.85,
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
});

/**
 * Verse-specific styles
 */
export const commonVerseStyles = StyleSheet.create({
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.xl,
  },
  verseNumberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  speakerName: {
    marginLeft: SIZES.spacing.sm,
    opacity: 0.9,
  },
  verseSection: {
    marginBottom: SIZES.spacing.xl,
  },
  sectionHeader: {
    marginBottom: SIZES.spacing.md,
  },
  sectionTitle: {
    textAlign: 'center',
  },
  languageContainer: {
    alignItems: 'center',
  },
  favoriteContainer: {
    marginTop: SIZES.spacing.sm,
  },
});

/**
 * Combine all common styles for convenience
 */
export const commonStyles = {
  screen: commonScreenStyles,
  card: commonCardStyles,
  section: commonSectionStyles,
  text: commonTextStyles,
  listItem: commonListItemStyles,
  layout: commonLayoutStyles,
  header: commonHeaderStyles,
  verse: commonVerseStyles,
};

