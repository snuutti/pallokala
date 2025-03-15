import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import OperatorList from "@/components/templates/operator/OperatorList";
import { useStyle } from "@/hooks/useStyle";

export default function InstallScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            description: {
                color: colors.text,
                marginBottom: 10
            }
        })
    );

    return (
        <ContentWrapper>
            <Text style={style.description}>{t("templates:description.Install")}</Text>

            <OperatorList
                operations={[]}
                setOperations={() => {}}
                addLabel={t("templates:AddInstallStep")}
            />
        </ContentWrapper>
    );
}