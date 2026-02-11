import { useEffect, cloneElement, ReactNode } from "react";
import { TouchableWithoutFeedback, StyleSheet, Keyboard } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, runOnJS } from "react-native-reanimated";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useStyle } from "@/hooks/useStyle";
import useBackHandler from "@/hooks/useBackHandler";

type ModalWrapperProps = {
    id: string;
    closable?: boolean;
    content: ReactNode;
    closeModal: (id: string) => void;
};

export default function ModalWrapper(props: ModalWrapperProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            overlay: {
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                width: "100%",
                height: "100%"
            },
            modalWrapper: {
                width: "80%",
                maxWidth: 400,
                maxHeight: "80%"
            },
            modal: {
                maxHeight: "100%",
                backgroundColor: colors.backdrop,
                padding: 20,
                borderRadius: 16,
                boxShadow: colors.raised
            }
        })
    );
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
        if (props.closable === false) {
            return true;
        }

        handleClose();
        return true;
    });

    const tryClose = () => {
        if (props.closable === false) {
            return;
        }

        handleClose();
    };

    const handleClose = () => {
        Keyboard.dismiss();
        modalOpacity.value = withTiming(0, { duration: 200 });
        scale.value = withSpring(0);
        opacity.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(props.closeModal)(props.id);
        });
    };

    return (
        <TouchableWithoutFeedback onPress={tryClose}>
            <Animated.View style={[style.overlay, backgroundStyle]}>
                <KeyboardAvoidingView behavior="padding" style={style.modalWrapper}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Animated.View style={[style.modal, modalStyle]}>
                            {cloneElement(props.content as any, { handleClose })}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}