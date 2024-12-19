import { useState } from "react";
import { View, Text, KeyboardTypeOptions, StyleSheet } from "react-native";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { PromptModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";

export type PromptModalOptions = {
    defaultValue?: string;
    placeholder?: string;
    inputType?: KeyboardTypeOptions;
};

type PromptModalProps = {
    title?: string;
    options?: PromptModalOptions;
    buttons?: PromptModalButton[];
    handleClose?: () => void;
};

export default function PromptModal(props: PromptModalProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
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
        })
    );
    const [hasSelected, setHasSelected] = useState(false);
    const [value, setValue] = useState(props.options?.defaultValue || "");

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
                placeholder={props.options?.placeholder}
                autoCapitalize="none"
                keyboardType={props.options?.inputType}
                editable={!hasSelected}
                autoFocus={true}
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