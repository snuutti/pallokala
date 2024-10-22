import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type CopyableProps = {
    text: string;
};

export default function Copyable(props: CopyableProps) {
    const { style, colors } = useStyle(styling);

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(props.text);
    };

    return (
        <View style={style.container}>
            <ScrollView horizontal={true}>
                <Text selectable={true} style={style.text}>{props.text}</Text>
            </ScrollView>

            <TouchableOpacity style={style.copy} onPress={copyToClipboard}>
                <MaterialCommunityIcons name="content-copy" size={30} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            marginVertical: 5,
            padding: 10,
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
    });
}