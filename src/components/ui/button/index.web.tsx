import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import {
    useStyleContext,
    withStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import {
    buttonGroupStyle,
    buttonIconStyle,
    buttonSpinnerStyle,
    buttonStyle,
    buttonTextStyle,
} from './styles';

const SCOPE = 'BUTTON';
const Root = withStyleContext((props: any) => <button {...props} />, SCOPE);

type IButtonProps = React.ComponentPropsWithoutRef<'button'> &
    VariantProps<typeof buttonStyle>;
const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
    ({ className, variant = 'solid', size = 'md', action = 'primary', ...props }, ref) => {
        return (
            <Root
                ref={ref}
                {...props}
                className={buttonStyle({ variant, size, action, class: className })}
                context={{ variant, size, action }}
            />
        );
    }
);

type IButtonTextProps = React.ComponentPropsWithoutRef<'span'> &
    VariantProps<typeof buttonTextStyle>;
const ButtonText = React.forwardRef<HTMLSpanElement, IButtonTextProps>(
    ({ className, variant, size, action, ...props }, ref) => {
        const {
            variant: parentVariant,
            size: parentSize,
            action: parentAction,
        } = useStyleContext(SCOPE);

        return (
            <span
                ref={ref}
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
    }
);

type IButtonGroupProps = React.ComponentPropsWithoutRef<'div'> &
    VariantProps<typeof buttonGroupStyle>;
const ButtonGroup = React.forwardRef<HTMLDivElement, IButtonGroupProps>(
    ({ className, space, isAttached, flexDirection, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={buttonGroupStyle({
                    space,
                    isAttached,
                    flexDirection,
                    class: className,
                })}
            />
        );
    }
);

type IButtonIconProps = React.ComponentPropsWithoutRef<'div'> &
    VariantProps<typeof buttonIconStyle> & {
        as?: React.ElementType;
        height?: number;
        width?: number;
    };
const ButtonIcon = React.forwardRef<HTMLDivElement, IButtonIconProps>(
    ({ className, size, as: As, ...props }, ref) => {
        const {
            variant: parentVariant,
            size: parentSize,
            action: parentAction,
        } = useStyleContext(SCOPE);

        if (As) {
            return (
                <As
                    className={buttonIconStyle({
                        parentVariants: {
                            variant: parentVariant,
                            size: parentSize,
                            action: parentAction,
                        },
                        size,
                        class: className,
                    })}
                    {...props}
                />
            );
        }

        return (
            <div
                ref={ref}
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
    }
);

type IButtonSpinnerProps = React.ComponentPropsWithoutRef<'div'> &
    VariantProps<typeof buttonSpinnerStyle>;
const ButtonSpinner = React.forwardRef<HTMLDivElement, IButtonSpinnerProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={buttonSpinnerStyle({ class: className })}
            />
        );
    }
);

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonGroup.displayName = 'ButtonGroup';
ButtonIcon.displayName = 'ButtonIcon';
ButtonSpinner.displayName = 'ButtonSpinner';

export { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText };

