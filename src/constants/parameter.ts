// Design System Constants
import { SIZES } from '@/rootconstants/sizes';
import { typography as TYPOGRAPHY } from '@/rootconstants/typography';
import { ANIMATION } from './animation';
import { Z_INDEX } from './zIndex';

export const PARAMETERS = {
  SIZES,
  TYPOGRAPHY,
  ANIMATION,
  Z_INDEX,
} as const;

export default PARAMETERS;
