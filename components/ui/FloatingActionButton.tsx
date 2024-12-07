import { useState, useCallback, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useDerivedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyle } from "@/hooks/useStyle";

type FloatingActionButtonProps = {
    visible?: boolean;
    color?: string;
    onPress: () => void;
    safeArea?: boolean;
    children: ReactNode;
};

export default function FloatingActionButton({ visible = true, color, onPress, safeArea, children }: FloatingActionButtonProps) {
    const { style, colors } = useStyle(() =>
        StyleSheet.create({
            container: {
                position: "absolute",
                right: 20,
                bottom: 20
            },
            fab: {
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            }
        })
    );
    const fabVisible = useSharedValue(1);
    const insets = useSafeAreaInsets();

    useDerivedValue(() => {
        fabVisible.value = visible ? 1 : 0;
    }, [visible]);

    const fabStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(fabVisible.value, { duration: 300 }),
            transform: [
                {
                    scale: withTiming(fabVisible.value, { duration: 300 }),
                }
            ]
        };
    });

    return (
        <Animated.View style={[style.container, fabStyle, safeArea && { marginBottom: insets.bottom }]}>
            <TouchableOpacity
                style={[style.fab, { backgroundColor: color || colors.primary }]}
                onPress={onPress}
                disabled={!visible}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};

export const useFabVisible = () => {
    const [fabVisible, setFabVisible] = useState(true);
    const [previousY, setPreviousY] = useState(0);

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentY = event.nativeEvent?.contentOffset?.y;
        if (currentY === undefined) {
            return;
        }

        const isScrollingUp = currentY < previousY || currentY <= 0;
        const isScrollingDown = currentY > previousY;

        if (isScrollingUp) {
            setFabVisible(true);
        } else if (isScrollingDown) {
            setFabVisible(false);
        }

        setPreviousY(currentY);
    }, [previousY]);

    return { fabVisible, setFabVisible, onScroll };
};