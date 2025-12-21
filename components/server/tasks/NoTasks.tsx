import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/hooks/useStyle";

export default function NoTasks() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            text: {
                color: colors.text,
                fontSize: 20,
                textAlign: "center"
            }
        })
    );

    return <Text style={style.text}>{t("app:Servers.Tasks.NoTasks")}</Text>;
}