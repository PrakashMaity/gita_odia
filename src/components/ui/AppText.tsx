import { VariantProps, tva } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { Text as RNText } from 'react-native';

const appTextVariants = tva({
    base: 'my-0 tracking-sm bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word',
    variants: {
        variant: {
            'page-title': 'text-2xl text-typography-900 leading-8 font-bold',
            'section-title': 'text-xl text-typography-900 leading-7 font-bold',
            'card-title': 'text-lg text-typography-900 leading-6 font-bold',
            body: 'text-base text-typography-700 leading-6',
            secondary: 'text-sm text-typography-500 leading-5',
            caption: 'text-xs text-typography-400 leading-4',
        },
        font: {
            'regional-primary': 'font-regional-primary',
            'regional-secondary': 'font-regional-secondary',
            english: 'font-english',
        },
        isTruncated: {
            true: 'truncate',
        },
        bold: {
            true: 'font-bold',
        },
        center: {
            true: 'text-center',
        },
    },
    defaultVariants: {
        variant: 'body',
        font: 'regional-secondary',
    },
});

type IAppTextProps = React.ComponentProps<typeof RNText> & VariantProps<typeof appTextVariants>;

const AppText = React.forwardRef<React.ComponentRef<typeof RNText>, IAppTextProps>(
    function AppText(
        {
            className,
            variant,
            font,
            isTruncated,
            bold,
            center,
            ...props
        },
        ref
    ) {
        return (
            <RNText
                className={appTextVariants({
                    variant,
                    font,
                    isTruncated,
                    bold,
                    center,
                    class: className,
                })}
                {...props}
                ref={ref}
            />
        );
    }
);

AppText.displayName = 'AppText';

export { AppText };
