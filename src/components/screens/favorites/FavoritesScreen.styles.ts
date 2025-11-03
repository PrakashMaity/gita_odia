import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
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
  favoriteCardContainer: {
    marginBottom: SIZES.spacing.md,
  },
  chatMessage: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.md,
  },
  speakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  speakerAvatar: {
    width: SIZES.avatar.lg,
    height: SIZES.avatar.lg,
    borderRadius: SIZES.radius.round,
    marginRight: SIZES.spacing.md,
  },
  speakerDetails: {
    flex: 1,
  },
  speakerName: {
    marginBottom: SIZES.spacing.xs,
  },
  favoriteDate: {
    opacity: 0.7,
  },
  messageContent: {
    paddingLeft: SIZES.spacing.xl + SIZES.spacing.md,
  },
  translationText: {
    lineHeight: 24,
    textAlign: 'justify',
  },
  removeButton: {
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.round,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
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

