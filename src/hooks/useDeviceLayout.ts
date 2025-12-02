import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const TABLET_BREAKPOINT = 768;
const LARGE_TABLET_BREAKPOINT = 1024;

export interface DeviceLayout {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  isLargeTablet: boolean;
  horizontalPadding: number;
  verticalPadding: number;
  contentMaxWidth: number;
  cardMaxWidth: number;
  sectionSpacing: number;
  stackSpacing: number;
  gridColumns: 1 | 2 | 3;
  gridItemWidthPercent: string;
}

export const useDeviceLayout = (): DeviceLayout => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const shortestEdge = Math.min(width, height);
    const longestEdge = Math.max(width, height);

    const isTablet = shortestEdge >= TABLET_BREAKPOINT;
    const isLargeTablet = shortestEdge >= LARGE_TABLET_BREAKPOINT || longestEdge >= 1200;

    const horizontalPadding = isTablet ? (isLandscape ? 48 : 40) : 20;
    const verticalPadding = isTablet ? 32 : 24;

    const maxWidthTarget = isTablet ? (isLandscape ? 1180 : 960) : width;
    const contentMaxWidth = Math.min(maxWidthTarget, width);
    const cardMaxWidth = Math.min(isTablet ? (isLandscape ? 760 : 640) : width, contentMaxWidth);

    const sectionSpacing = isTablet ? 32 : 20;
    const stackSpacing = isTablet ? 28 : 18;

    let gridColumns: 1 | 2 | 3 = 1;
    if (isTablet) {
      gridColumns = isLandscape && width >= 1100 ? 3 : 2;
    }

    const gridItemWidthPercent =
      gridColumns === 3 ? '31%' : gridColumns === 2 ? '47%' : '100%';

    return {
      width,
      height,
      isLandscape,
      isTablet,
      isLargeTablet,
      horizontalPadding,
      verticalPadding,
      contentMaxWidth,
      cardMaxWidth,
      sectionSpacing,
      stackSpacing,
      gridColumns,
      gridItemWidthPercent,
    };
  }, [height, width]);
};


