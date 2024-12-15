import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";

type PortMappingField = {
    host: string;
    outsidePort: number;
    insidePort: number;
    protocol: "tcp" | "udp";
};

type PortMappingInputProps = {
    label?: string;
    description?: string;
    error?: string;
    fields: string[];
    onChange: (fields: string[]) => void;
    addLabel?: string;
};

export default function PortMappingInput(props: PortMappingInputProps) {
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
    const [entries, setEntries] = useState<PortMappingField[]>([]);

    useEffect(() => {
        const newEntries: PortMappingField[] = [];

        for (const field of props.fields) {
            const [head, protocol] = field.split("/");
            const [host, outsidePort, insidePort] = head.split(":");
            newEntries.push({
                host,
                outsidePort: parseInt(outsidePort),
                insidePort: parseInt(insidePort),
                protocol: protocol as "tcp" | "udp"
            });
        }

        setEntries(newEntries);
    }, []);

    const addEntry = () => {
        const newEntries = [...entries];
        newEntries.push({
            host: "0.0.0.0",
            outsidePort: 0,
            insidePort: 0,
            protocol: "tcp"
        });

        setEntries(newEntries);
    };

    const removeEntry = (index: number) => {
        const newEntries = [...entries];
        newEntries.splice(index, 1);
        setEntries(newEntries);
        onChange(newEntries);
    };

    const onInput = (index: number, key: string, value: unknown) => {
        const newEntries = [...entries];
        newEntries[index] = {
            ...newEntries[index],
            [key]: value
        };

        setEntries(newEntries);
        onChange(newEntries);
    };

    const onChange = (newEntries: PortMappingField[]) => {
        const result: string[] = [];

        for (const entry of newEntries) {
            result.push(`${entry.host}:${entry.outsidePort}:${entry.insidePort}/${entry.protocol}`);
        }

        props.onChange(result);
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
                <View style={style.field} key={index}>
                    <TextInput
                        placeholder={t("common:Host")}
                        value={entry.host}
                        onChangeText={(value) => onInput(index, "host", value)}
                    />

                    <TextInput
                        placeholder={t("env:docker.OutsidePort")}
                        value={entry.outsidePort.toString()}
                        onChangeText={(value) => onInput(index, "outsidePort", Number(value))}
                        keyboardType="number-pad"
                    />

                    <TextInput
                        placeholder={t("env:docker.InsidePort")}
                        value={entry.insidePort.toString()}
                        onChangeText={(value) => onInput(index, "insidePort", Number(value))}
                        keyboardType="number-pad"
                    />

                    <TextInput
                        placeholder={t("common:Protocol")}
                        value={entry.protocol}
                        onChangeText={(value) => onInput(index, "protocol", value)}
                    />

                    <Button
                        text={t("common:Remove")}
                        icon="trash-can"
                        style="danger"
                        onPress={() => removeEntry(index)}
                    />
                </View>
            ))}

            <Button
                text={props.addLabel || t("common:Add")}
                icon="plus"
                onPress={addEntry}
            />
        </>
    );
}