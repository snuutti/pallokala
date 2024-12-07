import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";

export type CopyableProps = {
    label?: string;
    text: string;
};

export default function Copyable(props: CopyableProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            label: {
                color: colors.text,
                marginHorizontal: 16,
                marginTop: 5,
                alignSelf: "flex-start"
            },
            container: {
                width: "100%",
                flexDirection: "row",
                flexWrap: "nowrap",
                alignItems: "center",
                marginVertical: 5,
                padding: 16,
                borderRadius: 16,
                borderColor: colors.textDisabled,
                borderWidth: 2,
                backgroundColor: colors.background
            },
            text: {
                flexGrow: 1,
                flexShrink: 1,
                color: colors.text
            },
            copy: {
                marginLeft: 10
            }
        })
    );

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(props.text);
    };

    return (
        <>
            {props.label && (
                <Text style={style.label}>{props.label}</Text>
            )}

            <View style={style.container}>
                <ScrollView horizontal={true}>
                    <Text selectable={true} style={style.text}>{props.text}</Text>
                </ScrollView>

                <TouchableOpacity style={style.copy} onPress={copyToClipboard}>
                    <MaterialCommunityIcons name="content-copy" size={30} color={colors.text} />
                </TouchableOpacity>
            </View>
        </>
    );
}