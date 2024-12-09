import { TextInputProps as RNTextInputProps, TextInput as RNTextInput, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/hooks/useStyle";

export type TextInputProps = RNTextInputProps & {
    hideLabel?: boolean; // TODO: I need to make an actual label prop instead
    error?: string;
    errorFields?: Record<string, unknown>;
    description?: string | JSX.Element | JSX.Element[];
};

export default function TextInput(props: TextInputProps) {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            label: {
                color: colors.text,
                marginHorizontal: 16,
                marginTop: 5,
                alignSelf: "flex-start"
            },
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
                marginHorizontal: 16,
                marginBottom: 5,
                alignSelf: "flex-start"
            },
            description: {
                color: colors.textDisabled,
                marginHorizontal: 16,
                marginBottom: 5,
                alignSelf: "flex-start"
            }
        })
    );

    return (
        <>
            {(props.placeholder && !props.hideLabel) && (
                <Text style={style.label}>{props.placeholder}</Text>
            )}

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
                <Text style={style.errorText}>{t(props.error, props.errorFields)}</Text>
            )}

            {props.description && (
                <Text style={style.description}>{props.description}</Text>
            )}
        </>
    );
}