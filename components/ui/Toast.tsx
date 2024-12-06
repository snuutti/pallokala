import React, { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    runOnJS,
    interpolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type ToastType = "success" | "error";

type ToastProps = {
    id: string;
    type: ToastType;
    message: string;
    onDismiss: (id: string) => void;
    onPress?: () => void;
};

export default function Toast(props: ToastProps) {
    const { style } = useStyle(styling);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const [dismissTimeout, setDismissTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        translateX.value = withSpring(0);
        opacity.value = withTiming(1, { duration: 500 });

        resetTimeout();
    }, []);

    const resetTimeout = useCallback(() => {
        if (dismissTimeout) {
            clearTimeout(dismissTimeout);
        }

        setDismissTimeout(setTimeout(() => {
            translateY.value = withSpring(-100, {}, () => runOnJS(props.onDismiss)(props.id));
        }, 3000));
    }, [dismissTimeout]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value }, // Swiping
            { translateY: translateY.value } // Auto-dismiss
        ],
        opacity: opacity.value * interpolate(translateX.value, [-100, 0, 100], [0, 1, 0])
    }));

    const cancelTimeout = () => {
        if (dismissTimeout) {
            clearTimeout(dismissTimeout);
            setDismissTimeout(null);
        }
    };

    const swipeGesture = Gesture.Pan()
        .onBegin(() => {
            runOnJS(cancelTimeout)();
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > 100) {
                runOnJS(props.onDismiss)(props.id);
            } else {
                translateX.value = withSpring(0);
            }

            runOnJS(resetTimeout)();
        });

    return (
        <GestureDetector gesture={swipeGesture}>
            <Animated.View style={[style.container, props.type === "success" ? style.success : style.error, animatedStyle]}>
                <TouchableOpacity onPress={props.onPress}>
                    <Text style={style.message}>{props.message}</Text>
                </TouchableOpacity>
            </Animated.View>
        </GestureDetector>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            padding: 10,
            borderRadius: 5,
            borderTopWidth: 5,
            marginBottom: 10,
            elevation: 5
        },
        success: {
            borderTopColor: colors.success
        },
        error: {
            borderTopColor: colors.error
        },
        message: {
            color: colors.text,
            fontSize: 16
        }
    });
}