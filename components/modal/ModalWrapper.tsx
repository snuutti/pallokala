import { useEffect, cloneElement, ReactNode } from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, runOnJS } from "react-native-reanimated";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import useBackHandler from "@/hooks/useBackHandler";

type ModalWrapperProps = {
    id: string;
    content: ReactNode;
    closeModal: (id: string) => void;
};

export default function ModalWrapper(props: ModalWrapperProps) {
    const { style } = useStyle(styling);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0);
    const modalOpacity = useSharedValue(0);

    const backgroundStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        };
    });

    const modalStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: modalOpacity.value
        };
    });

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 200 });
        scale.value = withSpring(1);
        modalOpacity.value = withTiming(1, { duration: 200 });
    }, []);

    useBackHandler(() => {
        handleClose();
        return true;
    });

    const handleClose = () => {
        modalOpacity.value = withTiming(0, { duration: 200 });
        scale.value = withSpring(0);
        opacity.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(props.closeModal)(props.id);
        });
    };

    return (
        <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View style={[style.overlay, backgroundStyle]}>
                <TouchableWithoutFeedback>
                    <Animated.View style={[style.modal, modalStyle]}>
                        {cloneElement(props.content as any, { handleClose })}
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width: "100%",
            height: "100%"
        },
        modal: {
            width: "80%",
            maxWidth: 400,
            backgroundColor: colors.backdrop,
            padding: 20,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        }
    });
}