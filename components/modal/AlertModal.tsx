import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
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
    const { style } = useStyle(styling);
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
                    <Button
                        key={index}
                        text={button.text}
                        icon={button.icon}
                        style={button.style}
                        onPress={() => onButtonPressed(button)}
                        disabled={hasSelected}
                    />
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
        }
    });
}