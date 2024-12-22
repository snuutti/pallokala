import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Markdown from "@/components/ui/Markdown";
import Button from "@/components/ui/Button";
import { ModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";

type AlertModalProps = {
    title?: string;
    message?: string;
    markdown?: string;
    buttons?: ModalButton[];
    handleClose?: () => void;
};

export default function AlertModal(props: AlertModalProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                flexShrink: 1,
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
            scrollView: {
                width: "100%"
            },
            buttons: {
                width: "100%",
                flexDirection: "column"
            }
        })
    );
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

            {props.markdown && (
                <ScrollView style={style.scrollView}>
                    <View onStartShouldSetResponder={() => true}>
                        <Markdown text={props.markdown} />
                    </View>
                </ScrollView>
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