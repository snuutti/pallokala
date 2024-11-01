import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";

export default function LoadingScreen() {
    const { style, colors } = useStyle(styling);

    return (
        <View style={style.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

function styling() {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }
    });
}