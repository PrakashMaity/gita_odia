import { H1, H2, H3, H4, H5, H6 } from '@expo/html-elements';
import { VariantProps, tva } from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import React, { forwardRef, memo } from 'react';

cssInterop(H1, { className: 'style' });
cssInterop(H2, { className: 'style' });
cssInterop(H3, { className: 'style' });
cssInterop(H4, { className: 'style' });
cssInterop(H5, { className: 'style' });
cssInterop(H6, { className: 'style' });

const appHeadingVariants = tva({
    base: 'my-0 tracking-sm bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word',
    variants: {
        variant: {
            page: 'text-2xl text-typography-900 leading-8 font-bold',
            section: 'text-xl text-typography-900 leading-7 font-bold',
            card: 'text-lg text-typography-900 leading-6 font-bold',
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
        variant: 'section',
        font: 'regional-secondary',
    },
});

type IAppHeadingProps = React.ComponentPropsWithoutRef<typeof H1> & VariantProps<typeof appHeadingVariants> & {
    as?: React.ElementType;
};

const MappedHeading = memo(
    forwardRef<React.ComponentRef<typeof H1>, IAppHeadingProps>(
        function MappedHeading(
            {
                variant,
                font,
                className,
                isTruncated,
                bold,
                center,
                ...props
            },
            ref
        ) {
            const headingClass = appHeadingVariants({
                variant,
                font,
                isTruncated,
                bold,
                center,
                class: className,
            });

            switch (variant) {
                case 'page':
                    return <H1 className={headingClass} {...props} ref={ref as any} />;
                case 'section':
                    return <H2 className={headingClass} {...props} ref={ref as any} />;
                case 'card':
                    return <H3 className={headingClass} {...props} ref={ref as any} />;
                default:
                    return <H2 className={headingClass} {...props} ref={ref as any} />;
            }
        }
    )
);

const AppHeading = memo(
    forwardRef<React.ComponentRef<typeof H1>, IAppHeadingProps>(function AppHeading(
        { className, variant = 'section', font, as: AsComp, ...props },
        ref
    ) {
        if (AsComp) {
            return (
                <AsComp
                    className={appHeadingVariants({
                        variant,
                        font,
                        isTruncated: props.isTruncated,
                        bold: props.bold,
                        center: props.center,
                        class: className,
                    })}
                    {...props}
                />
            );
        }

        return (
            <MappedHeading
                className={className}
                variant={variant}
                font={font}
                ref={ref}
                {...props}
            />
        );
    })
);

AppHeading.displayName = 'AppHeading';

export { AppHeading };
