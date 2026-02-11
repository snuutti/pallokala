import { JSX } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeOutUp, FadeInUp, LinearTransition } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";

export type ListInputProps = {
    label?: string;
    description?: string | JSX.Element | JSX.Element[];
    value: string[];
    onValueChange: (value: string[]) => void;
    addLabel?: string;
};

export default function ListInput(props: ListInputProps) {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            label: {
                color: colors.text,
                marginHorizontal: 16,
                marginTop: 5,
                alignSelf: "flex-start"
            },
            item: {
                flexDirection: "row",
                alignItems: "center",
            },
            input: {
                flexGrow: 1,
                flexShrink: 1
            },
            leftMargin: {
                marginLeft: 10
            },
            actionDisabled: {
                opacity: 0.4
            },
            description: {
                color: colors.textDisabled
            }
        })
    );

    const onValueChange = (value: string, index: number) => {
        const newValue = [...props.value];
        newValue[index] = value;
        props.onValueChange(newValue);
    };

    const swap = (index1: number, index2: number) => {
        const newValue = [...props.value];
        const temp = newValue[index1];
        newValue[index1] = newValue[index2];
        newValue[index2] = temp;
        props.onValueChange(newValue);
    };

    const remove = (index: number) => {
        const newValue = [...props.value];
        newValue.splice(index, 1);
        props.onValueChange(newValue);
    };

    const add = () => {
        const newValue = [...props.value, ""];
        props.onValueChange(newValue);
    };

    return (
        <>
            {props.label && (
                <Text style={style.label}>{props.label}</Text>
            )}

            {props.value.map((item, index) => (
                <Animated.View key={index} layout={LinearTransition} exiting={FadeOutUp} entering={FadeInUp} style={style.item}>
                    <TextInput
                        value={item}
                        onChangeText={(value) => onValueChange(value, index)}
                        style={style.input}
                    />

                    <TouchableOpacity
                        onPress={() => swap(index, index - 1)}
                        disabled={index === 0}
                    >
                        <MaterialCommunityIcons
                            name="chevron-up"
                            size={30}
                            color={colors.text}
                            style={[style.leftMargin, index === 0 && style.actionDisabled]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => swap(index, index + 1)}
                        disabled={index === props.value.length - 1}
                    >
                        <MaterialCommunityIcons
                            name="chevron-down"
                            size={30}
                            color={colors.text}
                            style={[style.leftMargin, index === props.value.length - 1 && style.actionDisabled]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => remove(index)}>
                        <MaterialCommunityIcons
                            name="trash-can"
                            size={30}
                            color={colors.text}
                            style={style.leftMargin}
                        />
                    </TouchableOpacity>
                </Animated.View>
            ))}

            <Button
                text={props.addLabel || t("common:Add")}
                icon="plus"
                onPress={add}
            />

            {props.description && (
                <Text style={style.description}>{props.description}</Text>
            )}
        </>
    );
}