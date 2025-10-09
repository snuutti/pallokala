import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/hooks/useStyle";

export default function DeletingServerModal() {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                justifyContent: "center",
                alignItems: "center"
            },
            text: {
                color: colors.text,
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10
            }
        })
    );
    const { t } = useTranslation();

    return (
        <View style={style.container}>
            <Text style={style.text}>{t("servers:Deleting")}</Text>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}