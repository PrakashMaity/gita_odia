import { SIZES } from './sizes';

export const LAYOUT = {
  container: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  
  section: {
    marginVertical: SIZES.spacing.lg,
  },
  
  grid: {
    gap: SIZES.spacing.md,
    columnGap: SIZES.spacing.lg,
    rowGap: SIZES.spacing.md,
  },
  
  listItem: {
    paddingVertical: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.lg,
  },
  
  form: {
    fieldSpacing: SIZES.spacing.lg,
    groupSpacing: SIZES.spacing.xl,
  },
} as const;
