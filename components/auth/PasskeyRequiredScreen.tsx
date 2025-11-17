import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { useStyle } from "@/hooks/useStyle";

export default function PasskeyRequiredScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            contentContainer: {
                justifyContent: "center"
            },
            header: {
                color: colors.text,
                fontSize: 32,
                marginVertical: 5
            }
        })
    );
    const { present } = useSwitchServerModal();

    return (
        <ContentWrapper contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>{t("app:Auth.PasskeyLoginUnsupported")}</Text>

            <Button
                text={t("app:Auth.SelectServer")}
                icon="swap-horizontal"
                onPress={present}
            />
        </ContentWrapper>
    );
}