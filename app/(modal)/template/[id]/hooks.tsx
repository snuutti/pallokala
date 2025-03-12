import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import OperatorList from "@/components/templates/operator/OperatorList";
import { useStyle } from "@/hooks/useStyle";

export default function HooksScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            header: {
                color: colors.text,
                fontSize: 16
            },
            description: {
                color: colors.text,
                marginBottom: 10
            }
        })
    );

    return (
        <ContentWrapper>
            <Text style={style.header}>{t("templates:PreRunHook")}</Text>
            <Text style={style.description}>{t("templates:description.PreRunHook")}</Text>

            <OperatorList
                operations={[]}
                setOperations={() => {}}
                addLabel={t("templates:AddPreStep")}
            />

            <Text style={style.header}>{t("templates:PostRunHook")}</Text>
            <Text style={style.description}>{t("templates:description.PostRunHook")}</Text>

            <OperatorList
                operations={[]}
                setOperations={() => {}}
                addLabel={t("templates:AddPostStep")}
            />
        </ContentWrapper>
    );
}