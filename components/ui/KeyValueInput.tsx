import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, { FadeOutUp, FadeInUp, LinearTransition } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";

type KeyValueField = {
    key: string;
    value: unknown;
};

type KeyValueInputProps = {
    label?: string;
    description?: string;
    error?: string;
    fields: Record<string, unknown>;
    onChange: (fields: Record<string, unknown>) => void;
    keyLabel: string;
    valueLabel: string;
    addLabel?: string;
};

export default function KeyValueInput(props: KeyValueInputProps) {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
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
            },
            errorText: {
                color: colors.error,
                marginHorizontal: 16,
                marginBottom: 5,
                alignSelf: "flex-start"
            },
            field: {
                borderRadius: 16,
                borderColor: colors.textDisabled,
                borderWidth: 2,
                marginVertical: 5,
                padding: 16
            }
        })
    );
    const [entries, setEntries] = useState<KeyValueField[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const newEntries: KeyValueField[] = [];

        for (const field in props.fields) {
            newEntries.push({
                key: field,
                value: props.fields[field]
            });
        }

        setEntries(newEntries);
    }, []);

    const addEntry = () => {
        setEntries([...entries, { key: "", value: "" }]);
    };

    const removeEntry = (index: number) => {
        const newEntries = [...entries];
        newEntries.splice(index, 1);
        setEntries(newEntries);
        onChange(newEntries);
    };

    const onChange = (newEntries: KeyValueField[]) => {
        const result: Record<string, unknown> = {};
        const newErrors: Record<string, string> = {};

        for (const entry of newEntries) {
            if (!entry.key) {
                continue;
            }

            if (!result[entry.key] && result[entry.key] !== "") {
                result[entry.key] = entry.value;
            } else {
                newErrors[entry.key] = t("errors:DuplicateKey");
            }
        }

        setErrors(newErrors);
        props.onChange(result);
    };

    const onKeyChange = (index: number, key: string) => {
        const newEntries = [...entries];
        newEntries[index].key = key;
        setEntries(newEntries);
        onChange(newEntries);
    };

    const onValueChange = (index: number, value: string) => {
        const newEntries = [...entries];
        newEntries[index].value = value;
        setEntries(newEntries);
        onChange(newEntries);
    };

    return (
        <>
            {props.label && (
                <Text style={style.label}>{props.label}</Text>
            )}

            {props.description && (
                <Text style={style.description}>{props.description}</Text>
            )}

            {props.error && (
                <Text style={style.errorText}>{props.error}</Text>
            )}

            {entries.map((entry, index) => (
                <Animated.View layout={LinearTransition} exiting={FadeOutUp} entering={FadeInUp} style={style.field} key={index}>
                    <TextInput
                        value={entry.key}
                        onChangeText={(key) => onKeyChange(index, key)}
                        placeholder={props.keyLabel}
                        error={errors[entry.key]}
                    />

                    <TextInput
                        value={entry.value as string}
                        onChangeText={(value) => onValueChange(index, value)}
                        placeholder={props.valueLabel}
                    />

                    <Button
                        text={t("common:Remove")}
                        icon="trash-can"
                        style="danger"
                        onPress={() => removeEntry(index)}
                    />
                </Animated.View>
            ))}

            <Button
                text={props.addLabel || t("common:Add")}
                icon="plus"
                onPress={addEntry}
            />
        </>
    );
}