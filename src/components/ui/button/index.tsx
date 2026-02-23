'use client';
import { createButton } from '@gluestack-ui/core/button/creator';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import {
    useStyleContext,
    withStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from 'react-native';
import {
    buttonGroupStyle,
    buttonIconStyle,
    buttonSpinnerStyle,
    buttonStyle,
    buttonTextStyle,
} from './styles';

const SCOPE = 'BUTTON';
const Root = withStyleContext(Pressable, SCOPE);

const UIButton = createButton({
    Root,
    Text,
    Group: View,
    Spinner: ActivityIndicator,
    Icon: View,
});

type IButtonProps = React.ComponentPropsWithoutRef<typeof Root> &
    VariantProps<typeof buttonStyle>;
const Button = React.forwardRef<React.ElementRef<typeof Pressable>, IButtonProps>(
    ({ className, variant = 'solid', size = 'md', action = 'primary', ...props }, ref) => {
        return (
            <UIButton
                ref={ref}
                {...props}
                className={buttonStyle({ variant, size, action, class: className })}
                context={{ variant, size, action }}
            />
        );
    }
);

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof Text> &
    VariantProps<typeof buttonTextStyle>;
const ButtonText = React.forwardRef<
    React.ElementRef<typeof Text>,
    IButtonTextProps
>(({ className, variant, size, action, ...props }, ref) => {
    const {
        variant: parentVariant,
        size: parentSize,
        action: parentAction,
    } = useStyleContext(SCOPE);

    return (
        <UIButton.Text
            ref={ref as any}
            {...props}
            className={buttonTextStyle({
                parentVariants: {
                    variant: parentVariant,
                    size: parentSize,
                    action: parentAction,
                },
                variant,
                size,
                action,
                class: className,
            })}
        />
    );
});

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof buttonGroupStyle>;
const ButtonGroup = React.forwardRef<
    React.ElementRef<typeof View>,
    IButtonGroupProps
>(({ className, space, isAttached, flexDirection, ...props }, ref) => {
    return (
        <UIButton.Group
            ref={ref as any}
            {...(props as any)}
            className={buttonGroupStyle({
                space,
                isAttached,
                flexDirection,
                class: className,
            })}
        />
    );
});

type IButtonIconProps = React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof buttonIconStyle> & {
        as?: React.ElementType;
        height?: number;
        width?: number;
    };
const ButtonIcon = React.forwardRef<
    React.ElementRef<typeof View>,
    IButtonIconProps
>(({ className, size, ...props }, ref) => {
    const {
        variant: parentVariant,
        size: parentSize,
        action: parentAction,
    } = useStyleContext(SCOPE);

    if (typeof size === 'number') {
        return (
            <UIButton.Icon
                ref={ref as any}
                {...props}
                className={buttonIconStyle({ class: className })}
                // @ts-ignore
                size={size as any}
            />
        );
    } else if (
        (props?.height !== undefined || props?.width !== undefined) &&
        size === undefined
    ) {
        return (
            <UIButton.Icon
                ref={ref as any}
                {...props}
                className={buttonIconStyle({ class: className })}
            />
        );
    }

    return (
        <UIButton.Icon
            ref={ref as any}
            {...props}
            className={buttonIconStyle({
                parentVariants: {
                    variant: parentVariant,
                    size: parentSize,
                    action: parentAction,
                },
                size,
                class: className,
            })}
        />
    );
});

type IButtonSpinnerProps = React.ComponentPropsWithoutRef<
    typeof ActivityIndicator
> &
    VariantProps<typeof buttonSpinnerStyle>;
const ButtonSpinner = React.forwardRef<
    React.ElementRef<typeof ActivityIndicator>,
    IButtonSpinnerProps
>(({ className, color, ...props }, ref) => {
    const { action: parentAction, variant: parentVariant } =
        useStyleContext(SCOPE);

    const spinnerColor = useMemo(() => {
        if (color) return color;
        if (parentVariant === 'solid') {
            if (parentAction === 'primary' || parentAction === 'positive' || parentAction === 'negative') {
                return 'white';
            }
        }
        return 'gray';
    }, [color, parentAction, parentVariant]);

    return (
        <UIButton.Spinner
            ref={ref as any}
            {...props}
            color={spinnerColor}
            className={buttonSpinnerStyle({ class: className })}
        />
    );
});

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonGroup.displayName = 'ButtonGroup';
ButtonIcon.displayName = 'ButtonIcon';
ButtonSpinner.displayName = 'ButtonSpinner';

export { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText };

