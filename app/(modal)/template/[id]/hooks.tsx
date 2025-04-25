import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import RemoteTemplateAlert from "@/components/templates/RemoteTemplateAlert";
import OperatorList from "@/components/templates/operator/OperatorList";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";
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
                color: colors.textDisabled,
                marginBottom: 10
            },
            operatorList: {
                marginBottom: 10
            }
        })
    );
    const { template, setTemplate } = useTemplateEditor();

    return (
        <ContentWrapper>
            <RemoteTemplateAlert />

            <Text style={style.header}>{t("templates:PreRunHook")}</Text>
            <Text style={style.description}>{t("templates:description.PreRunHook")}</Text>

            <OperatorList
                operations={template?.run.pre || []}
                setOperations={(operations) => {
                    setTemplate({ ...template!, run: { ...template!.run, pre: operations } });
                }}
                addLabel={t("templates:AddPreStep")}
                style={style.operatorList}
            />

            <Text style={style.header}>{t("templates:PostRunHook")}</Text>
            <Text style={style.description}>{t("templates:description.PostRunHook")}</Text>

            <OperatorList
                operations={template?.run.post || []}
                setOperations={(operations) => {
                    setTemplate({ ...template!, run: { ...template!.run, post: operations } });
                }}
                addLabel={t("templates:AddPostStep")}
            />
        </ContentWrapper>
    );
}