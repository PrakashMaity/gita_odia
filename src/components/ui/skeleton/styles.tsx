import { tva } from '@gluestack-ui/utils/nativewind-utils';

export const skeletonStyle = tva({
    base: "bg-background-200",
    variants: {
        variant: {
            rounded: "rounded-md",
            sharp: "rounded-none",
            circular: "rounded-full",
        },
        speed: {
            1: "duration-75",
            2: "duration-100",
            3: "duration-150",
            4: "duration-200",
        },
    },
});

export const skeletonTextStyle = tva({
    base: "bg-background-200",
    variants: {
        speed: {
            1: "duration-75",
            2: "duration-100",
            3: "duration-150",
            4: "duration-200",
        },
        gap: {
            1: "gap-1",
            2: "gap-2",
            3: "gap-3",
            4: "gap-4",
        },
    },
});
