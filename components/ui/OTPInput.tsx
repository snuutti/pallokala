import { useRef, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { OTPInput as NativeOTPInput, OTPInputRef, SlotProps } from "input-otp-native";
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { useStyle } from "@/hooks/useStyle";

export type OTPInputProps = {
    label?: string;
    error?: string;
    errorFields?: Record<string, unknown>;
    editable?: boolean;
    clearOnComplete?: boolean;
    blurOnComplete?: boolean;
    onChange?: (code: string) => void;
    onComplete?: (code: string) => void;
};

export default function OTPInput(props: OTPInputProps) {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            label: {
                color: colors.text,
                marginHorizontal: 16,
                marginTop: 5,
                alignSelf: "flex-start"
            },
            container: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 5
            },
            slotsContainer: {
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between"
            },
            errorText: {
                color: colors.error,
                marginHorizontal: 16,
                marginBottom: 5,
                alignSelf: "flex-start"
            }
        })
    );
    const ref = useRef<OTPInputRef>(null);

    const onChange = (code: string) => {
        if (props.onChange) {
            props.onChange(code);
        }
    };

    const onComplete = (code: string) => {
        if (props.onComplete) {
            props.onComplete(code);
        }

        if (props.clearOnComplete) {
            ref.current?.clear();
        }

        if (props.blurOnComplete) {
            ref.current?.blur();
        }
    };

    return (
        <>
            {props.label && (
                <Text style={style.label}>{props.label}</Text>
            )}

            <NativeOTPInput
                ref={ref}
                onChange={onChange}
                onComplete={onComplete}
                containerStyle={style.container}
                maxLength={6}
                editable={props.editable}
                render={({ slots }) => (
                    <View style={style.slotsContainer}>
                        {slots.map((slot, index) => (
                            <Slot key={index} {...slot} disabled={props.editable === false} />
                        ))}
                    </View>
                )}
            />

            {props.error && (
                <Text style={style.errorText}>{t(props.error, props.errorFields)}</Text>
            )}
        </>
    );
}

type ExtendedSlotProps = SlotProps & {
    disabled: boolean;
};

function Slot(props: ExtendedSlotProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            slot: {
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                borderColor: colors.textDisabled,
                borderWidth: 2,
                backgroundColor: colors.background
            },
            activeSlot: {
                borderColor: colors.primary,
                borderWidth: 2
            },
            char: {
                color: colors.text,
                fontSize: 24,
                fontWeight: "500"
            },
            disabled: {
                opacity: 0.5
            }
        })
    );

    return (
        <View
            style={[
                style.slot,
                props.isActive && style.activeSlot,
                props.disabled && style.disabled
            ]}
        >
            {props.char !== null && (
                <Text style={style.char}>{props.char}</Text>
            )}

            {props.hasFakeCaret && <FakeCaret />}
        </View>
    );
}

function FakeCaret() {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            fakeCaretContainer: {
                position: "absolute",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            },
            fakeCaret: {
                width: 2,
                height: 28,
                backgroundColor: colors.primary
            }
        })
    );
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0, { duration: 500 }),
                withTiming(1, { duration: 500 })
            ),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <View style={style.fakeCaretContainer}>
            <Animated.View style={[style.fakeCaret, animatedStyle]} />
        </View>
    );
}