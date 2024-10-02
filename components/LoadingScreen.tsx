import { View, ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import { Colors, getColors } from "@/constants/Colors";

export default function LoadingScreen() {
    const colorScheme = useColorScheme();

    const colors = getColors(colorScheme);
    const style = styling(colors);

    return (
        <View style={style.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background
        }
    });
}