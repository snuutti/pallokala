import { Switch as RNSwitch, View, Text, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";

export type SwitchProps = {
    label: string;
    description?: string | JSX.Element | JSX.Element[];
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
};

export default function Switch(props: SwitchProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                flexDirection: "row",
                flexWrap: "nowrap",
                alignItems: "center",
                marginVertical: 5
            },
            disabled: {
                opacity: 0.5
            },
            textContainer: {
                flex: 1,
                marginLeft: 10
            },
            name: {
                color: colors.text
            },
            description: {
                color: colors.textDisabled
            }
        })
    );

    return (
        <View style={style.container}>
            <RNSwitch
                thumbColor={colors.textPrimary}
                trackColor={{ false: "#bbb", true: colors.primary }}
                value={props.value}
                onValueChange={props.onValueChange}
                disabled={props.disabled}
                style={props.disabled && style.disabled}
            />

            <View style={style.textContainer}>
                <Text style={style.name}>{props.label}</Text>

                {props.description && (
                    <Text style={style.description}>{props.description}</Text>
                )}
            </View>
        </View>
    );
}