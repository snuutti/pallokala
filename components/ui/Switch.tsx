import { JSX } from "react";
import { Switch as RNSwitch, View, Text, StyleSheet, Platform } from "react-native";
import { Host, Switch as EUISwitch } from "@expo/ui/jetpack-compose";
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
            {Platform.OS === "android" ? (
                <Host matchContents={true}>
                    <EUISwitch
                        value={props.value}
                        onCheckedChange={props.onValueChange}
                        enabled={!props.disabled}
                        colors={{
                            checkedThumbColor: colors.textPrimary,
                            checkedTrackColor: colors.primary
                        }}
                    />
                </Host>
            ) : (
                <RNSwitch
                    thumbColor={colors.textPrimary}
                    trackColor={{ false: "#bbb", true: colors.primary }}
                    value={props.value}
                    onValueChange={props.onValueChange}
                    disabled={props.disabled}
                />
            )}

            <View style={style.textContainer}>
                <Text style={style.name}>{props.label}</Text>

                {props.description && (
                    <Text style={style.description}>{props.description}</Text>
                )}
            </View>
        </View>
    );
}