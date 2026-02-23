import { isWeb, tva } from '@gluestack-ui/utils/nativewind-utils';

const baseStyle = isWeb
    ? 'flex flex-row items-center justify-center rounded-xl bg-primary-500 relative z-0 box-border border-0 list-none min-w-0 min-h-0 m-0 p-0 text-decoration-none'
    : '';

export const buttonStyle = tva({
    base: `group/button rounded-xl flex-row items-center justify-center bg-primary-500 data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2 ${baseStyle}`,
    variants: {
        action: {
            primary:
                'bg-white data-[hover=true]:opacity-90 data-[active=true]:opacity-80',
            secondary:
                'bg-neutral-800 border-neutral-700 data-[hover=true]:bg-neutral-700 data-[active=true]:bg-neutral-600',
            positive:
                'bg-white data-[hover=true]:opacity-90 data-[active=true]:opacity-80',
            negative:
                'bg-red-500 data-[hover=true]:bg-red-600 data-[active=true]:bg-red-700',
            default:
                'bg-transparent data-[hover=true]:bg-neutral-100 data-[active=true]:bg-transparent',
        },
        variant: {
            link: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
            outline:
                'bg-transparent border border-neutral-200 data-[hover=true]:bg-neutral-50 data-[active=true]:bg-transparent',
            solid: '',
        },
        size: {
            xs: 'px-3.5 h-8',
            sm: 'px-4 h-9',
            md: 'px-5 h-10',
            lg: 'px-6 h-11',
            xl: 'px-7 h-12',
        },
    },
    compoundVariants: [
        {
            action: 'primary',
            variant: 'link',
            class:
                'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
        },
        {
            action: 'secondary',
            variant: 'link',
            class:
                'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
        },
        {
            action: 'positive',
            variant: 'link',
            class:
                'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
        },
        {
            action: 'negative',
            variant: 'link',
            class:
                'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
        },
        {
            action: 'primary',
            variant: 'outline',
            class:
                'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
        },
        {
            action: 'secondary',
            variant: 'outline',
            class:
                'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
        },
        {
            action: 'positive',
            variant: 'outline',
            class:
                'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
        },
        {
            action: 'negative',
            variant: 'outline',
            class:
                'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
        },
    ],
});

export const buttonTextStyle = tva({
    base: 'text-typography-0 font-semibold web:select-none',
    parentVariants: {
        action: {
            primary:
                'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
            secondary:
                'text-typography-500 data-[hover=true]:text-typography-600 data-[active=true]:text-typography-700',
            positive:
                'text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700',
            negative:
                'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
        },
        variant: {
            link: 'data-[hover=true]:underline data-[active=true]:underline',
            outline: '',
            solid:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
        size: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
        },
    },
    parentCompoundVariants: [
        {
            variant: 'solid',
            action: 'primary',
            class:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
        {
            variant: 'solid',
            action: 'secondary',
            class:
                'text-typography-800 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800',
        },
        {
            variant: 'solid',
            action: 'positive',
            class:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
        {
            variant: 'solid',
            action: 'negative',
            class:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
        {
            variant: 'outline',
            action: 'primary',
            class:
                'text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500',
        },
        {
            variant: 'outline',
            action: 'secondary',
            class:
                'text-typography-500 data-[hover=true]:text-primary-600 data-[active=true]:text-typography-700',
        },
        {
            variant: 'outline',
            action: 'positive',
            class:
                'text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500',
        },
        {
            variant: 'outline',
            action: 'negative',
            class:
                'text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500',
        },
    ],
});

export const buttonIconStyle = tva({
    base: 'fill-none',
    parentVariants: {
        variant: {
            link: 'data-[hover=true]:underline data-[active=true]:underline',
            outline: '',
            solid:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
        size: {
            xs: 'h-3.5 w-3.5',
            sm: 'h-4 w-4',
            md: 'h-[18px] w-[18px]',
            lg: 'h-[18px] w-[18px]',
            xl: 'h-5 w-5',
        },
        action: {
            primary:
                'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
            secondary:
                'text-typography-500 data-[hover=true]:text-typography-600 data-[active=true]:text-typography-700',
            positive:
                'text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700',
            negative:
                'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
        },
    },
    parentCompoundVariants: [
        {
            variant: 'solid',
            action: 'primary',
            class:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
        {
            variant: 'solid',
            action: 'secondary',
            class:
                'text-typography-800 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800',
        },
        {
            variant: 'solid',
            action: 'positive',
            class:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
        {
            variant: 'solid',
            action: 'negative',
            class:
                'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
        },
    ],
});

export const buttonGroupStyle = tva({
    base: '',
    variants: {
        space: {
            xs: 'gap-1',
            sm: 'gap-2',
            md: 'gap-3',
            lg: 'gap-4',
            xl: 'gap-5',
            '2xl': 'gap-6',
            '3xl': 'gap-7',
            '4xl': 'gap-8',
        },
        isAttached: {
            true: 'gap-0',
        },
        flexDirection: {
            row: 'flex-row',
            column: 'flex-col',
            'row-reverse': 'flex-row-reverse',
            'column-reverse': 'flex-col-reverse',
        },
    },
});

export const buttonSpinnerStyle = tva({
    base: '',
});
