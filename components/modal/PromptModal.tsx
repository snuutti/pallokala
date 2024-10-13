import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardTypeOptions, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PromptModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

type PromptModalProps = {
    title?: string;
    placeholder?: string;
    inputType?: KeyboardTypeOptions;
    buttons?: PromptModalButton[];
    handleClose?: () => void;
};

export default function PromptModal(props: PromptModalProps) {
    const { style, colors } = useStyle(styling);
    const [hasSelected, setHasSelected] = useState(false);
    const [value, setValue] = useState("");

    const onButtonPressed = (button: PromptModalButton) => {
        if (hasSelected) {
            return;
        }

        setHasSelected(true);
        button.onPress?.(value);
        props.handleClose!();
    };

    return (
        <View style={style.container}>
            {props.title && (
                <Text style={style.title}>{props.title}</Text>
            )}

            <TextInput
                defaultValue={value}
                onChangeText={setValue}
                placeholder={props.placeholder}
                placeholderTextColor={colors.textPrimary}
                autoCapitalize="none"
                keyboardType={props.inputType}
                style={style.input}
                editable={!hasSelected}
            />

            <View style={style.buttons}>
                {props.buttons?.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            style.button,
                            button.style === "danger" && style.buttonDanger,
                            button.style === "success" && style.buttonSuccess
                        ]}
                        onPress={() => onButtonPressed(button)}
                        disabled={hasSelected}
                    >
                        {button.icon && (
                            <MaterialCommunityIcons name={button.icon} size={30} color={colors.text} style={style.buttonIcon} />
                        )}

                        <Text style={style.buttonText}>{button.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center"
        },
        title: {
            color: colors.text,
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10
        },
        input: {
            width: "100%",
            marginVertical: 5,
            padding: 16,
            borderRadius: 16,
            borderColor: "#D7D7D7", // TODO
            borderWidth: 2,
            color: colors.textPrimary,
            backgroundColor: colors.background
        },
        buttons: {
            width: "100%",
            flexDirection: "column"
        },
        button: {
            width: "100%",
            height: 48,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 5,
            backgroundColor: colors.primary,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },
        buttonDanger: {
            backgroundColor: colors.error
        },
        buttonSuccess: {
            backgroundColor: colors.success
        },
        buttonIcon: {
            marginRight: 10
        },
        buttonText: {
            color: colors.textPrimary,
            textAlign: "center"
        }
    });
}