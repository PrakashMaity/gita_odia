import React from "react";
import { skeletonStyle, skeletonTextStyle } from "./styles";

const Skeleton = ({
    className,
    variant = "rounded",
    speed = 2,
    startColor,
    isLoaded = false,
    children,
    ...props
}: any) => {
    if (isLoaded) return children;

    return (
        <div
            {...props}
            className={skeletonStyle({ variant, speed, class: `animate-pulse ${className}` })}
            style={{
                backgroundColor: startColor,
                ...props.style,
            }}
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
    if (isLoaded) return children;

    return (
        <div
            {...props}
            className={skeletonTextStyle({ speed, gap, class: className })}
        >
            {Array.from({ length: _lines }).map((_, index) => (
                <div
                    key={index}
                    className={skeletonStyle({
                        variant: "rounded",
                        speed,
                        class: `h-3 w-full mb-2 animate-pulse ${className}`,
                    })}
                    style={{
                        backgroundColor: startColor,
                    }}
                />
            ))}
        </div>
    );
};

export { Skeleton, SkeletonText };
