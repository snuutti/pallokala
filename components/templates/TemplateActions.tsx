import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";

type TemplateActionsProps = {
    isValid: boolean;
};

export default function TemplateActions(props: TemplateActionsProps) {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { template, saveTemplate } = useTemplateEditor();
    const { createAlertModal } = useModal();
    const { showSuccessAlert } = useToast();

    const deleteAlert = () => {
        createAlertModal(
            t("templates:ConfirmDelete", { name: template!.display || template!.name }),
            undefined,
            [
                {
                    text: t("templates:Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteTemplate
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const deleteTemplate = async () => {
        await apiClient!.template.delete(template!.name);
        showSuccessAlert(t("templates:Deleted"));
        router.dismissTo("/(app)/templates");
    };

    const save = async () => {
        await saveTemplate();
        showSuccessAlert(t("templates:Saved"));
    };

    return (
        <>
            <Button
                text={t("templates:Delete")}
                icon="trash-can"
                style="danger"
                onPress={deleteAlert}
                disabled={!template || template.repository !== 0}
            />

            <Button
                text={t("templates:Save")}
                icon="content-save"
                onPress={save}
                disabled={!props.isValid || !template || template.repository !== 0}
            />
        </>
    );
}