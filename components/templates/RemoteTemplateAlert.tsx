import { useTranslation } from "react-i18next";
import Alert from "@/components/ui/Alert";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";

export default function RemoteTemplateAlert() {
    const { t } = useTranslation();
    const { template } = useTemplateEditor();

    if (!template || template.repository === 0) {
        return null;
    }

    return <Alert variant="info" text={t("templates:EditLocalOnly")} />;
}