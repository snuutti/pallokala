import { useState } from "react";
import { View, Text, KeyboardTypeOptions, StyleSheet } from "react-native";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
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
    const { style } = useStyle(styling);
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
                autoCapitalize="none"
                keyboardType={props.inputType}
                editable={!hasSelected}
            />

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
        buttons: {
            width: "100%",
            flexDirection: "column"
        }
    });
}