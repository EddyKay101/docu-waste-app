import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    interpolate,
    withSpring,
    withRepeat,
    SVGAdapter
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import Barcode from '../svgComp/Barcode';
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const ScanButton = ({ setScanned, setOpened }) => {
    const cornerOneAnimate = useSharedValue(0);
    const cornerTwoAnimate = useSharedValue(0);
    const cornerThreeAnimate = useSharedValue(0);
    const cornerFourAnimate = useSharedValue(0);

    useEffect(() => {
        cornerOneAnimate.value = withRepeat(withSpring(cornerOneAnimate === 0 ? 3 : -1), -1, true);
        cornerTwoAnimate.value = withRepeat(withSpring(cornerTwoAnimate === 0 ? 3 : 1), -1, true);
        cornerThreeAnimate.value = withRepeat(withSpring(cornerThreeAnimate === 0 ? 3 : 1), -1, true);
        cornerFourAnimate.value = withRepeat(withSpring(cornerFourAnimate === 0 ? 3 : 1), -1, true);
    }, []);


    const cornerOneTransform = useAnimatedProps(
        () => {


            return { transform: `translate(${interpolate(cornerOneAnimate.value, [3, 0], [0, 3])} ${interpolate(cornerOneAnimate.value, [3, 0], [0, 3])})` };
        },
        null,
        SVGAdapter
    );
    const cornerTwoTransform = useAnimatedProps(
        () => {


            return { transform: `translate(${interpolate(cornerTwoAnimate.value, [-9, 3], [3, -9])} ${interpolate(cornerTwoAnimate.value, [0, -3], [3, 0])})` };
        },
        null,
        SVGAdapter
    );

    const cornerThreeTransform = useAnimatedProps(
        () => {
            return { transform: `translate(${interpolate(cornerOneAnimate.value, [10, -7], [-7, 10])}, ${interpolate(cornerOneAnimate.value, [7, -8], [-4, -2])})` };
        },
        null,
        SVGAdapter
    );

    const cornerFourTransform = useAnimatedProps(
        () => {


            return { transform: `translate(${interpolate(cornerFourAnimate.value, [-9, 3], [3, -9])} ${interpolate(cornerFourAnimate.value, [-15, -9], [2, 0])})` };
        },
        null,
        SVGAdapter
    );
    const barcode = new Barcode();
    return (
        <View style={styles.container}>

            <Svg onPress={() => {
                setScanned(false);
                setOpened(true);
            }} style={{ alignSelf: "center" }} width="300" height="300" viewBox="0 0 144.89 139.3">
                <AnimatedPath
                    d="M28.8.17V9.55H11.88V31.14H2.51V3.69A3.53,3.53,0,0,1,6,.17Z"
                    strokeWidth={0.71}
                    fill="#1d1d1b"
                    stroke="#1d1d1b"
                    stroke-miterlimit={10}
                    animatedProps={cornerOneTransform}
                />
                <AnimatedPath
                    d="M147.06,4.63V31.14h-9.38V9.56H120.79V.17H142.6A4.46,4.46,0,0,1,147.06,4.63Z"
                    strokeWidth={0.71}
                    fill="#1d1d1b"
                    stroke="#1d1d1b"
                    stroke-miterlimit={10}
                    animatedProps={cornerTwoTransform}
                />
                <AnimatedPath
                    d="M2.51,112.85h9.38v16.89H33.48v9.39H6a3.53,3.53,0,0,1-3.52-3.52Z"
                    strokeWidth={0.71}
                    fill="#1d1d1b"
                    stroke="#1d1d1b"
                    stroke-miterlimit={10}
                    animatedProps={cornerThreeTransform}
                />
                <AnimatedPath
                    d="M142.6,139.13H116.09v-9.38h21.58V112.86h9.39v21.81A4.46,4.46,0,0,1,142.6,139.13Z"
                    strokeWidth={0.71}
                    fill="#1d1d1b"
                    stroke="#1d1d1b"
                    stroke-miterlimit={10}
                    animatedProps={cornerFourTransform}
                />
                {
                    barcode.rects.map((rect, key) => (
                        <AnimatedRect
                            key={key}
                            x={rect.x}
                            y="19.46"
                            width={rect.width}
                            height="101"
                            strokeWidth={0.71}
                            fill="#1d1d1b"
                            stroke="#1d1d1b"
                            strokeMiterlimit={10}
                        />
                    ))
                }

            </Svg>

        </View>
    );

}

const styles = StyleSheet.create({
    placement: {
        alignSelf: 'center',
        margin: 16,
        fontSize: 300
    },
});



export default ScanButton;
