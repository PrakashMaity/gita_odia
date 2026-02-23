import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { skeletonStyle, skeletonTextStyle } from "./styles";

const AnimatedView = Animated.View;

const Skeleton = ({
    className,
    variant = "rounded",
    speed = 2,
    startColor,
    isLoaded = false,
    children,
    ...props
}: any) => {
    const pulseAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000 / speed,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.4,
                    duration: 1000 / speed,
                    useNativeDriver: true,
                }),
            ])
        );

        if (!isLoaded) {
            animation.start();
        } else {
            animation.stop();
        }

        return () => animation.stop();
    }, [isLoaded, speed, pulseAnim]);

    if (isLoaded) return children;

    return (
        <AnimatedView
            {...props}
            className={skeletonStyle({ variant, speed, class: className })}
            style={[
                { opacity: pulseAnim },
                startColor ? { backgroundColor: startColor } : null,
                props.style,
            ]}
        />
    );
};

const SkeletonText = ({
    className,
    _lines = 3,
    gap = 2,
    speed = 2,
    startColor,
    isLoaded = false,
    children,
    ...props
}: any) => {
    const pulseAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000 / speed,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.4,
                    duration: 1000 / speed,
                    useNativeDriver: true,
                }),
            ])
        );

        if (!isLoaded) {
            animation.start();
        } else {
            animation.stop();
        }

        return () => animation.stop();
    }, [isLoaded, speed, pulseAnim]);

    if (isLoaded) return children;

    return (
        <AnimatedView
            {...props}
            className={skeletonTextStyle({ speed, gap, class: className })}
            style={[{ opacity: pulseAnim }, props.style]}
        >
            {Array.from({ length: _lines }).map((_, index) => (
                <AnimatedView
                    key={index}
                    className={skeletonStyle({ variant: "rounded", speed, class: "h-3 w-full mb-2" })}
                    style={[
                        startColor ? { backgroundColor: startColor } : null,
                    ]}
                />
            ))}
        </AnimatedView>
    );
};

export { Skeleton, SkeletonText };
