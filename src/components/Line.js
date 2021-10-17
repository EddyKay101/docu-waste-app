import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, StyleSheet, Button } from 'react-native';

const Line = () => {
    const dropAnim = useRef(new Animated.Value(0)).current;
    const [animationLineHeight, setAnimationLineHeight] = useState(0);

    useEffect(() => {
        animateLine()
    }, [])
    const animateLine = () => {
        Animated.sequence([
            Animated.timing(dropAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(dropAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }),
        ]).start(animateLine)
    }

    return (
        <View
            onLayout={e => setAnimationLineHeight(e.nativeEvent.layout.height)}
            style={styles.focusedContainer}>
            <Animated.View
                style={[
                    styles.lineStyle,
                    {
                        transform: [
                            {
                                translateY: dropAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, animationLineHeight],
                                }),
                            },
                        ]
                    },
                ]}
            >
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    lineStyle: {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
    },
    focusedContainer: {
        flex: 6,
    },

})

export default Line;
