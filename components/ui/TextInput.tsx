import { TextInputProps as RNTextInputProps, TextInput as RNTextInput, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type TextInputProps = RNTextInputProps;

export default function TextInput(props: TextInputProps) {
    const { style, colors } = useStyle(styling);

    return (
        <RNTextInput
            {...props}
            style={[style.input, props.style, props.editable === false && style.disabled]}
            placeholderTextColor={colors.textDisabled}
        />
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
        }
    });
}