import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useStyle } from "@/hooks/useStyle";

type ProgressBarProps = {
    max: number;
    value: number;
    text?: string;
};

export default function ProgressBar(props: ProgressBarProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                width: "100%",
                height: 40,
                backgroundColor: colors.background,
                borderRadius: 16,
                marginVertical: 5,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            },
            progress: {
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                backgroundColor: colors.primary,
                borderRadius: 16
            },
            text: {
                color: colors.text
            }
        })
    );
    const progress = useSharedValue((props.value / props.max) * 100);

    useEffect(() => {
        progress.value = withTiming((props.value / props.max) * 100, { duration: 100 });
    }, [props.value, props.max]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`
    }));

    return (
        <View style={style.container}>
            <Animated.View style={[style.progress, animatedStyle]} />

            {props.text && <Text style={style.text}>{props.text}</Text>}
        </View>
    );
}