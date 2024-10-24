import { TextInputProps as RNTextInputProps, TextInput as RNTextInput, Text, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type TextInputProps = RNTextInputProps & {
    error?: string;
};

export default function TextInput(props: TextInputProps) {
    const { style, colors } = useStyle(styling);

    return (
        <>
            <RNTextInput
                {...props}
                style={[
                    style.input,
                    props.style,
                    props.editable === false && style.disabled,
                    props.error && style.error
                ]}
                placeholderTextColor={colors.textDisabled}
            />

            {props.error && (
                <Text style={style.errorText}>{props.error}</Text>
            )}
        </>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        input: {
            width: "100%",
            marginVertical: 5,
            padding: 16,
            borderRadius: 16,
            borderColor: colors.textDisabled,
            borderWidth: 2,
            color: colors.text,
            backgroundColor: colors.background
        },
        disabled: {
            opacity: 0.5
        },
        error: {
            borderColor: colors.error
        },
        errorText: {
            color: colors.error,
            marginBottom: 5
        }
    });
}