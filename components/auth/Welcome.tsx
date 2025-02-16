import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/hooks/useStyle";

export default function Welcome() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            header: {
                color: colors.text,
                fontSize: 32
            },
            subheader: {
                color: colors.text,
                fontSize: 16,
                marginBottom: 5
            }
        })
    );

    return (
        <>
            <Text style={style.header}>{t("app:Auth.WelcomeHeader")}</Text>
            <Text style={style.subheader}>{t("app:Auth.WelcomeSubline")}</Text>
            <Text style={style.subheader}>{t("app:Auth.WelcomeNote")}</Text>
        </>
    );
}