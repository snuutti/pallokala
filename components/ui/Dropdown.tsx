import { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import { useModal, ModalButton } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type DropdownItem = {
    value: string;
    display: string;
};

export type DropdownProps = {
    options: DropdownItem[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    description?: string | JSX.Element | JSX.Element[];
    disabled?: boolean;
};

export default function Dropdown(props: DropdownProps) {
    const { style } = useStyle(styling);
    const { createListModal } = useModal();

    const activeOptions = useMemo(() => {
        return props.options.find(option => option.value === props.value);
    }, [props.options, props.value]);

    const openPicker = () => {
        const items: ModalButton[] = [];

        for (const option of props.options) {
            items.push({
                text: option.display,
                onPress: () => {
                    props.onChange(option.value);
                }
            });
        }

        createListModal(items);
    };

    return (
        <>
            {props.label && (
                <Text style={style.label}>{props.label}</Text>
            )}

            <Button
                text={activeOptions?.display || ""}
                onPress={openPicker}
                disabled={props.disabled}
            />

            {props.description && (
                <Text style={style.description}>{props.description}</Text>
            )}
        </>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        label: {
            color: colors.text,
            marginHorizontal: 16,
            marginTop: 5,
            alignSelf: "flex-start"
        },
        description: {
            color: colors.textDisabled,
            marginHorizontal: 16,
            marginBottom: 5,
            alignSelf: "flex-start"
        }
    });
}