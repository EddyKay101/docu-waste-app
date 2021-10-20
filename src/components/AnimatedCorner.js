import React, { useRef, useState } from "react";
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedProps } from "react-native-reanimated";
import { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCorner = ({ d, progress, strokeWidth, transform }) => {
    const animatedCornerProps = useAnimatedProps(() => ({
        transform: `translate(${progress.value}, 0)`
    }));
    const ref = useRef<Path>(null);
    return (
        <AnimatedPath
            d={d}
            strokeWidth={strokeWidth}
            transform={transform}
            fill="#1d1d1b"
            stroke="#1d1d1b"
            stroke-miterlimit={10}
            animatedProps={animatedCornerProps}
        />
    );
}

const styles = StyleSheet.create({})

export default AnimatedCorner;
