import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

type AlertModalProps = {
    title?: string;
    message?: string;
    buttons?: ModalButton[];
    handleClose?: () => void;
};

export default function AlertModal(props: AlertModalProps) {
    const { style, colors } = useStyle(styling);
    const [hasSelected, setHasSelected] = useState(false);

    const onButtonPressed = (button: ModalButton) => {
        if (hasSelected) {
            return;
        }

        setHasSelected(true);
        button.onPress?.();
        props.handleClose!();
    };

    return (
        <View style={style.container}>
            {props.title && (
                <Text style={style.title}>{props.title}</Text>
            )}

            {props.message && (
                <Text style={style.body}>{props.message}</Text>
            )}

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
        body: {
            color: colors.text,
            fontSize: 16,
            marginBottom: 20
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